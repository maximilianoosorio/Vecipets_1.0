import { Express } from 'express';
import 'multer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Mascota } from '../entities/mascota.entity';
import { Reporte, Imagen } from '../entities/reporte.entity';
import { Usuario } from '../entities/usuario.entity';
import { CrearReporteDto } from './dto/crear-reporte.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepo: Repository<Mascota>,
    @InjectRepository(Reporte)
    private readonly reporteRepo: Repository<Reporte>,
    @InjectRepository(Imagen)
    private readonly imagenRepo: Repository<Imagen>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // 1. Crear un nuevo reporte
  async crearReporte(
    dto: CrearReporteDto,
    usuarioLogueado: Usuario,
    archivosImagenes: Express.Multer.File[],
  ) {
    // Crear Mascota con las propiedades exactas del DTO
    const nuevaMascota = this.mascotaRepo.create({
      nombre: dto.nombre || 'Sin Nombre',
      especie: dto.especie,
      raza: dto.raza,
      color: dto.color,
      tamano: dto.tamano,
      sexo: dto.sexo,
      usuario: usuarioLogueado,
    });
    const mascotaGuardada = await this.mascotaRepo.save(nuevaMascota);

    // Crear Reporte con latitud, longitud y dirección tipadas
    const datosReporte: any = {
      mascota: mascotaGuardada,
      usuario: usuarioLogueado,
      tipoReporte: dto.tipoReporte,
      fechaEvento: dto.fechaEvento ? new Date(dto.fechaEvento) : new Date(),
      descripcion: dto.descripcion,
      direccion: dto.direccion,
      latitud: dto.latitud ? Number(dto.latitud) : null,
      longitud: dto.longitud ? Number(dto.longitud) : null,
      estado: (dto as any).estado || 'PUBLICADO',
    };

    const nuevoReporte = this.reporteRepo.create(datosReporte);
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
    return this.reporteRepo.find({
      where: {
        estado: In(['PUBLICADO', 'ACTIVO', 'PENDIENTE_APROBACION'] as any),
      },
      relations: {
        mascota: true,
        imagenes: true,
      },
      order: { creadoEn: 'DESC' } as any,
      take: 100,
    });
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
}