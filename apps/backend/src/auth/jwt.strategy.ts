import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        process.env.JWT_SECRET ||
        'secretKey',
    });
  }

  async validate(payload: any) {
    const userId = payload.sub || payload.id;

    if (!userId) {
      throw new UnauthorizedException('Token sin identificación de usuario');
    }

    // 1. Buscar usuario sin bloquear por si 'activo' viene null en Supabase
    let usuario: any = null;
    try {
      usuario = await this.usuarioRepo.findOne({
        where: { id: userId },
        relations: { rol: true },
      });
    } catch {
      usuario = await this.usuarioRepo.findOne({
        where: { id: userId },
      });
    }

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado en el sistema');
    }

    // 2. Solo rechazar si está explícitamente inactivo en false
    if (usuario.activo === false) {
      throw new UnauthorizedException('Tu cuenta se encuentra inactiva');
    }

    // 3. Extraer rol de forma segura
    const rolNombre =
      usuario.rol?.nombre ||
      (typeof usuario.rol === 'string' ? usuario.rol : payload.rol || 'CIUDADANO');

    const correoFinal = usuario.correo || usuario.email || payload.correo || payload.email;

    // 4. Inyectar usuario limpio en req.user
    return {
      id: usuario.id,
      sub: usuario.id,
      correo: correoFinal,
      email: correoFinal,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      rol: rolNombre,
    };
  }
}