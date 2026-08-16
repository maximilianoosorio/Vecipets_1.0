import 'multer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  // 1. Crear un nuevo reporte con su mascota e imágenes asociadas
  async crearReporte(
    dto: CrearReporteDto,
    usuarioLogueado: Usuario,
    archivosImagenes: Express.Multer.File[],
  ) {
    // a. Registrar la mascota
    const nuevaMascota = this.mascotaRepo.create({
      nombre: dto.nombreMascota || 'Sin Nombre',
      especie: dto.especie,
      raza: dto.raza,
      color: dto.color,
      tamano: dto.tamano,
      sexo: dto.sexo,
      caracteristicasEspeciales: dto.caracteristicasEspeciales,
      usuario: usuarioLogueado,
    });
    const mascotaGuardada = await this.mascotaRepo.save(nuevaMascota);

    // b. Crear el reporte asociado (pasa a moderación)
    const nuevoReporte = this.reporteRepo.create({
      mascota: mascotaGuardada,
      usuario: usuarioLogueado,
      tipoReporte: dto.tipoReporte,
      fechaEvento: new Date(dto.fechaEvento),
      descripcion: dto.descripcion,
      estado: 'PENDIENTE_APROBACION',
    });
    const reporteGuardado = await this.reporteRepo.save(nuevoReporte);

    // c. Subir imágenes a Cloudinary e insertarlas en BD
    if (archivosImagenes && archivosImagenes.length > 0) {
      for (const archivo of archivosImagenes) {
        const resultadoCloudinary = await this.cloudinaryService.subirImagen(archivo);
        
        const nuevaImagen = this.imagenRepo.create({
          mascota: mascotaGuardada,
          reporte: reporteGuardado,
          urlCloudinary: resultadoCloudinary.secure_url,
          publicId: resultadoCloudinary.public_id,
        });
        await this.imagenRepo.save(nuevaImagen);
      }
    }

    return {
      mensaje: 'Reporte registrado exitosamente y enviado a moderación',
      reporteId: reporteGuardado.id,
    };
  }

  // 2. Obtener solo reportes con estado PUBLICADO
  async obtenerReportesPublicos() {
    return this.reporteRepo.find({
      where: { estado: 'PUBLICADO' },
      relations: {
        mascota: true,
        imagenes: true,
      },
      order: { creadoEn: 'DESC' },
    });
  }

  // 3. Obtener un reporte por su ID ocultando credenciales sensibles
  async obtenerPorId(id: string) {
    const reporte = await this.reporteRepo.findOne({
      where: { id },
      relations: {
        mascota: true,
        imagenes: true,
        usuario: true,
      },
    });

    if (!reporte) {
      throw new NotFoundException('El reporte solicitado no existe');
    }

    // Ocultar datos sensibles del usuario
    if (reporte.usuario) {
      const { contrasenaHash, password, ...usuarioLimpio } = reporte.usuario as any;
      reporte.usuario = usuarioLimpio as Usuario;
    }

    return reporte;
  }

  // 4. Obtener reportes pendientes para el panel de moderación
  async obtenerPendientes() {
    return this.reporteRepo.find({
      where: { estado: 'PENDIENTE_APROBACION' },
      relations: {
        mascota: true,
        imagenes: true,
        usuario: true,
      },
      order: { creadoEn: 'ASC' },
    });
  }

  // 5. Cambiar el estado de un reporte (PUBLICADO, RECHAZADO, RESUELTO)
  async cambiarEstado(id: string, nuevoEstado: string) {
    const reporte = await this.reporteRepo.findOne({ where: { id } });

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

  // 6. Obtener únicamente los reportes creados por el usuario en sesión
  async obtenerMisReportes(usuarioId: string) {
    return this.reporteRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: {
        mascota: true,
        imagenes: true,
      },
      order: { creadoEn: 'DESC' },
    });
  }
}