import { Express } from 'express';
import 'multer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Mascota } from '../entities/mascota.entity';
import { Reporte, Imagen } from '../entities/reporte.entity';
import { Usuario } from '../entities/usuario.entity';
import { CrearReporteDto } from './dto/crear-reporte.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const DEFAULT_LATITUD = 6.2442;
const DEFAULT_LONGITUD = -75.5812;
const DEFAULT_DIRECCION = 'Medellín, Antioquia';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepo: Repository<Mascota>,
    @InjectRepository(Reporte)
    private readonly reporteRepo: Repository<Reporte>,
    @InjectRepository(Imagen)
    private readonly imagenRepo: Repository<Imagen>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // 1. Crear un nuevo reporte
  async crearReporte(
    dto: CrearReporteDto,
    usuarioLogueado: Usuario,
    archivosImagenes: Express.Multer.File[],
  ) {
    const rawDto = dto as any;

    // Crear Mascota
    const nuevaMascota = this.mascotaRepo.create({
      nombre: rawDto.nombre?.trim() || 'Sin Nombre',
      especie: rawDto.especie,
      raza: rawDto.raza,
      color: rawDto.color,
      tamano: rawDto.tamano,
      sexo: rawDto.sexo,
      usuario: usuarioLogueado,
    });
    const mascotaGuardada = await this.mascotaRepo.save(nuevaMascota);

    // Coordenadas con fallback a Medellín
    const rawLat = rawDto.latitud ?? rawDto.lat;
    const rawLng = rawDto.longitud ?? rawDto.lng;

    const latParsed = rawLat !== undefined && rawLat !== null && rawLat !== '' 
      ? Number(rawLat) 
      : DEFAULT_LATITUD;

    const lngParsed = rawLng !== undefined && rawLng !== null && rawLng !== '' 
      ? Number(rawLng) 
      : DEFAULT_LONGITUD;

    // Crear Reporte
    const nuevoReporte = this.reporteRepo.create({
      mascota: mascotaGuardada,
      usuario: usuarioLogueado,
      tipoReporte: rawDto.tipoReporte,
      fechaEvento: rawDto.fechaEvento ? new Date(rawDto.fechaEvento) : new Date(),
      descripcion: rawDto.descripcion,
      direccion: rawDto.direccion?.trim() || DEFAULT_DIRECCION,
      latitud: isNaN(latParsed) ? DEFAULT_LATITUD : latParsed,
      longitud: isNaN(lngParsed) ? DEFAULT_LONGITUD : lngParsed,
      estado: rawDto.estado || 'PUBLICADO',
    } as any);

    const reporteGuardado: any = await this.reporteRepo.save(nuevoReporte);

    // Subida a Cloudinary
    if (archivosImagenes && archivosImagenes.length > 0) {
      for (const archivo of archivosImagenes) {
        try {
          const resultadoCloudinary: any = await this.cloudinaryService.subirImagen(archivo);
          
          const nuevaImagen = this.imagenRepo.create({
            mascota: mascotaGuardada,
            reporte: reporteGuardado,
            urlCloudinary: resultadoCloudinary.secure_url || resultadoCloudinary.url,
            publicId: resultadoCloudinary.public_id,
          });
          await this.imagenRepo.save(nuevaImagen);
        } catch (error) {
          console.error('Error subiendo imagen a Cloudinary:', error);
        }
      }
    }

    return {
      mensaje: 'Reporte registrado exitosamente',
      reporteId: reporteGuardado.id,
    };
  }

  // 2. Obtener reportes públicos
  async obtenerReportesPublicos() {
    const reportes: any[] = await this.reporteRepo.find({
      relations: {
        mascota: true,
        imagenes: true,
      },
      order: {
        creadoEn: 'DESC',
      },
    });

    return reportes.map((r) => ({
      ...r,
      latitud: r.latitud ? Number(r.latitud) : DEFAULT_LATITUD,
      longitud: r.longitud ? Number(r.longitud) : DEFAULT_LONGITUD,
      direccion: r.direccion || DEFAULT_DIRECCION,
    }));
  }

  // 3. Obtener detalle de un reporte por ID
  async obtenerPorId(id: string) {
    const reporte: any = await this.reporteRepo.findOne({
      where: { id: id as any },
      relations: {
        mascota: true,
        imagenes: true,
        usuario: true,
      },
    });

    if (!reporte) {
      throw new NotFoundException('El reporte solicitado no existe');
    }

    if (reporte.usuario) {
      const { contrasenaHash, password, ...usuarioLimpio } = reporte.usuario;
      reporte.usuario = usuarioLimpio;
    }

    reporte.latitud = reporte.latitud ? Number(reporte.latitud) : DEFAULT_LATITUD;
    reporte.longitud = reporte.longitud ? Number(reporte.longitud) : DEFAULT_LONGITUD;

    return reporte;
  }

  // 4. Panel de moderación: Obtener reportes pendientes
  async obtenerPendientes() {
    return this.reporteRepo.find({
      where: { estado: 'PENDIENTE_APROBACION' as any },
      relations: {
        mascota: true,
        imagenes: true,
        usuario: true,
      },
      order: { creadoEn: 'ASC' } as any,
    });
  }

  // 5. Cambiar el estado de un reporte
  async cambiarEstado(id: string, nuevoEstado: string) {
    const reporte: any = await this.reporteRepo.findOne({
      where: { id: id as any },
    });

    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }

    reporte.estado = nuevoEstado;
    await this.reporteRepo.save(reporte);

    return {
      mensaje: `El reporte ha sido actualizado a estado: ${nuevoEstado}`,
      reporteId: id,
    };
  }

  // 6. Reportes creados por el usuario en sesión
  async obtenerMisReportes(usuarioId: string) {
    return this.reporteRepo.find({
      where: { usuario: { id: usuarioId as any } },
      relations: {
        mascota: true,
        imagenes: true,
      },
      order: { creadoEn: 'DESC' } as any,
    });
  }
  // Obtener refugios aliados registrados
  async obtenerRefugiosAliados() {
    const refugios = await this.usuarioRepo.find({
      relations: { rol: true },
    });

    // Filtra los usuarios cuyo rol sea 'REFUGIO'
    return refugios
      .filter((u: any) => {
        const rolNombre = (u.rol?.nombre || u.rol || '').toUpperCase();
        return rolNombre === 'REFUGIO';
      })
      .map((u: any) => ({
        id: u.id,
        nombre: u.nombre || u.nombreCompleto || 'Refugio Aliado',
        email: u.email || u.correo,
        telefono: u.telefono || 'No disponible',
        direccion: u.direccion || 'Medellín, Antioquia',
        capacidad: u.capacidad || 'Consultar disponibilidad',
      }));
  }
}