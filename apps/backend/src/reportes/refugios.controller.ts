import { Controller, Get } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('refugios')
export class RefugiosController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get()
  async obtenerRefugios() {
    return this.reportesService.obtenerRefugiosAliados();
  }
}