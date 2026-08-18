import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { RefugiosController } from './refugios.controller';
import { ReportesService } from './reportes.service';
import { Reporte, Imagen } from '../entities/reporte.entity';
import { Mascota } from '../entities/mascota.entity';
import { Usuario } from '../entities/usuario.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // o tu ruta a Cloudinary

@Module({
  imports: [
    TypeOrmModule.forFeature([Reporte, Mascota, Imagen, Usuario]),
    CloudinaryModule,
  ],
  controllers: [ReportesController, RefugiosController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}