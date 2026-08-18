import { Express } from 'express';
import 'multer';
import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
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
  private readonly logger = new Logger(ReportesService.name);

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

  // 1. Crear un nuevo reporte con persistencia garantizada en Supabase
  async crearReporte(
    dto: CrearReporteDto,
    usuarioLogueado: any,
    archivosImagenes: Express.Multer.File[] = [],
  ) {
    try {
      const rawDto = dto as any;

      // 1. Obtener la entidad real del usuario en la base de datos
      const idUsuario = usuarioLogueado?.id || usuarioLogueado?.sub;
      let usuarioEntidad = null;
      if (idUsuario) {
        usuarioEntidad = await this.usuarioRepo.findOne({
          where: { id: idUsuario },
        });
      }

      // 2. Crear y guardar Mascota en Supabase
      const nuevaMascota = this.mascotaRepo.create({
        nombre: rawDto.nombre?.trim() || rawDto.nombreMascota?.trim() || 'Sin Nombre',
        especie: (rawDto.especie || 'PERRO').toUpperCase(),
        raza: rawDto.raza?.trim() || 'Mestizo',
        color: rawDto.color?.trim() || 'No especificado',
        tamano: rawDto.tamano || rawDto.tamaño || 'MEDIANO',
        sexo: (rawDto.sexo || 'MACHO').toUpperCase(),
        usuario: usuarioEntidad || undefined,
      });
      const mascotaGuardada = await this.mascotaRepo.save(nuevaMascota);

      // 3. Normalizar Coordenadas
      const rawLat = rawDto.latitud ?? rawDto.lat;
      const rawLng = rawDto.longitud ?? rawDto.lng;

      const latParsed =
        rawLat !== undefined && rawLat !== null && rawLat !== ''
          ? Number(rawLat)
          : DEFAULT_LATITUD;

      const lngParsed =
        rawLng !== undefined && rawLng !== null && rawLng !== ''
          ? Number(rawLng)
          : DEFAULT_LONGITUD;

      // 4. Crear y guardar Reporte
      const nuevoReporte = this.reporteRepo.create({
        mascota: mascotaGuardada,
        usuario: usuarioEntidad || undefined,
        tipoReporte: (rawDto.tipoReporte || rawDto.tipo_reporte || 'PERDIDO').toUpperCase(),
        fechaEvento: rawDto.fechaEvento ? new Date(rawDto.fechaEvento) : new Date(),
        descripcion: rawDto.descripcion || 'Sin descripción.',
        direccion: rawDto.direccion?.trim() || DEFAULT_DIRECCION,
        latitud: isNaN(latParsed) ? DEFAULT_LATITUD : latParsed,
        longitud: isNaN(lngParsed) ? DEFAULT_LONGITUD : lngParsed,
        estado: (rawDto.estado || 'PUBLICADO').toUpperCase(),
      } as any);

      const reporteGuardado: any = await this.reporteRepo.save(nuevoReporte);

      // 5. Manejo de Imágenes (Cloudinary + Supabase)
      const imagenesParaGuardar: { url: string; publicId?: string }[] = [];

      // A) Subir archivos recibidos por Multer
      if (archivosImagenes && archivosImagenes.length > 0) {
        for (const archivo of archivosImagenes) {
          try {
            const resultado: any = await this.cloudinaryService.subirImagen(archivo);
            if (resultado?.secure_url || resultado?.url) {
              imagenesParaGuardar.push({
                url: resultado.secure_url || resultado.url,
                publicId: resultado.public_id || null,
              });
            }
          } catch (error: any) {
            this.logger.error(`Error al subir a Cloudinary: ${error.message}`);
          }
        }
      }

      // B) Guardar registros en la tabla 'imagenes'
      if (imagenesParaGuardar.length > 0) {
        try {
          const entidadesImagenes = imagenesParaGuardar.map((img) =>
            this.imagenRepo.create({
              mascota: mascotaGuardada,
              reporte: reporteGuardado,
              urlCloudinary: img.url,
              publicId: img.publicId || null,
            }),
          );
          await this.imagenRepo.save(entidadesImagenes);
          this.logger.log(`✅ Se guardaron ${entidadesImagenes.length} imágenes para el reporte ${reporteGuardado.id}`);
        } catch (err: any) {
          this.logger.error(`Error guardando en tabla imagenes: ${err.message}`, err.stack);
        }
      }

      return {
        mensaje: 'Reporte registrado exitosamente',
        reporteId: reporteGuardado.id,
        imagenesSubidas: imagenesParaGuardar.length,
      };
    } catch (error: any) {
      this.logger.error('🔥 Error crítico al crear reporte en Supabase:', error.message || error);
      throw new BadRequestException(error.message || 'Error al guardar el reporte');
    }
  }

  // 2. Obtener reportes públicos con imágenes garantizadas
  async obtenerReportesPublicos() {
    const reportes = await this.reporteRepo.find({
      relations: {
        mascota: true,
        imagenes: true,
        usuario: true,
      },
      order: {
        creadoEn: 'DESC',
      },
    });

    return reportes.map((r: any) => this.normalizarReporte(r));
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
      const { contrasenaHash, contrasena_hash, password, ...usuarioLimpio } = reporte.usuario;
      reporte.usuario = usuarioLimpio;
    }

    return this.normalizarReporte(reporte);
  }

  // 4. Panel de moderación: Obtener reportes pendientes
  async obtenerPendientes() {
    const reportes = await this.reporteRepo.find({
      where: { estado: 'PENDIENTE_APROBACION' as any },
      relations: {
        mascota: true,
        imagenes: true,
        usuario: true,
      },
      order: { creadoEn: 'ASC' } as any,
    });

    return reportes.map((r: any) => this.normalizarReporte(r));
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
    const reportes = await this.reporteRepo.find({
      where: { usuario: { id: usuarioId as any } },
      relations: {
        mascota: true,
        imagenes: true,
      },
      order: { creadoEn: 'DESC' } as any,
    });

    return reportes.map((r: any) => this.normalizarReporte(r));
  }

  // 7. Obtener refugios aliados registrados
  async obtenerRefugiosAliados() {
    const refugios = await this.usuarioRepo.find({
      relations: { rol: true },
    });

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

  // Helper privado para estructurar y normalizar fotos y coordenadas
  private normalizarReporte(r: any) {
    const fotosMapeadas = (r.imagenes || r.fotos || [])
      .map((img: any) => {
        const urlFinal = img.urlCloudinary || img.url_cloudinary || img.url || '';
        return {
          id: img.id,
          url: urlFinal,
          urlCloudinary: urlFinal,
          url_cloudinary: urlFinal,
        };
      })
      .filter((img: any) => Boolean(img.url));

    const fotoPrincipal =
      fotosMapeadas[0]?.url || r.mascota?.fotoUrl || r.mascota?.foto_url || null;

    return {
      ...r,
      latitud: r.latitud ? Number(r.latitud) : DEFAULT_LATITUD,
      longitud: r.longitud ? Number(r.longitud) : DEFAULT_LONGITUD,
      direccion: r.direccion || DEFAULT_DIRECCION,
      imagenes: fotosMapeadas,
      fotos: fotosMapeadas,
      fotoPrincipal,
    };
  }
}