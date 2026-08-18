import { Express } from 'express';
import 'multer';
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ReportesService } from './reportes.service';
import { CrearReporteDto } from './dto/crear-reporte.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // 🟢 1. CREAR REPORTE (Requiere Auth)
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('imagenes', 5))
  async crearReporte(
    @Body() crearReporteDto: CrearReporteDto,
    @UploadedFiles() imagenes: Express.Multer.File[],
    @Request() req,
  ) {
    return this.reportesService.crearReporte(crearReporteDto, req.user, imagenes);
  }

  // 🟢 2. RUTAS PÚBLICAS Y ESTÁTICAS (Siempre antes de :id)
  @Get('publicos')
  obtenerPublicos() {
    return this.reportesService.obtenerReportesPublicos();
  }

  @Get('refugios')
  async obtenerRefugios() {
    return this.reportesService.obtenerRefugiosAliados();
  }
  // 🔒 3. MIS REPORTES (Requiere Auth)
  @Get('mis-reportes')
  @UseGuards(JwtAuthGuard)
  obtenerMisReportes(@Request() req) {
    const usuarioId = req.user.sub || req.user.id;
    return this.reportesService.obtenerMisReportes(usuarioId);
  }

  // 🛡️ 4. RUTAS PARA MODERACIÓN (Requiere Rol MODERADOR o ADMINISTRADOR)
  @Get('pendientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MODERADOR', 'ADMINISTRADOR')
  obtenerPendientes() {
    return this.reportesService.obtenerPendientes();
  }

  // 🛡️ 5. CAMBIAR ESTADO
  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MODERADOR', 'ADMINISTRADOR')
  cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
  ) {
    return this.reportesService.cambiarEstado(id, estado);
  }

  // 🔍 6. OBTENER DETALLE POR ID (Siempre al final)
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.reportesService.obtenerPorId(id);
  }
}