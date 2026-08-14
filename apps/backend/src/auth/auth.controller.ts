import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  async registrar(@Body() registroDto: RegistroDto) {
    return this.authService.registrar(registroDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  obtenerPerfil(@Request() req) {
    return {
      mensaje: 'Perfil obtenido exitosamente',
      usuario: req.user,
    };
  }
}