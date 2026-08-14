import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Mascota } from '../entities/mascota.entity';
import { Reporte, Imagen } from '../entities/reporte.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mascota, Reporte, Imagen]),
    CloudinaryModule,
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}