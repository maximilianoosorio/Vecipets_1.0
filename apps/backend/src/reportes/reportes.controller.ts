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

  @Get('publicos')
  obtenerPublicos() {
    return this.reportesService.obtenerReportesPublicos();
  }

  // 🛡️ Ruta protegida solo para Moderadores y Admins
  @Get('pendientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MODERADOR', 'ADMINISTRADOR')
  obtenerPendientes() {
    return this.reportesService.obtenerPendientes();
  }

  // 🛡️ Ruta para aprobar/rechazar
  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MODERADOR', 'ADMINISTRADOR')
  cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
  ) {
    return this.reportesService.cambiarEstado(id, estado);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.reportesService.obtenerPorId(id);
  }
  @Get('mis-reportes')
  @UseGuards(JwtAuthGuard)
  obtenerMisReportes(@Request() req) {
    return this.reportesService.obtenerMisReportes(req.user.id);
  }
}