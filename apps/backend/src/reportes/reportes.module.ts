import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Reporte, Imagen } from '../entities/reporte.entity';
import { Mascota } from '../entities/mascota.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // 👈 Importar el módulo de Cloudinary

@Module({
  imports: [
    TypeOrmModule.forFeature([Reporte, Imagen, Mascota]),
    CloudinaryModule, // 👈 ¡Agregarlo aquí en imports!
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}