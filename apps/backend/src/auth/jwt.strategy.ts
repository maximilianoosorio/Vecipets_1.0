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
      // 🔴 CAMBIO AQUÍ: Usamos getOrThrow para garantizar que el tipo sea 'string' y no 'string | undefined'
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; correo: string; rol: string }) {
    const { sub: id } = payload;
    const usuario = await this.usuarioRepo.findOne({
      where: { id, activo: true },
      relations: { rol: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Token inválido o usuario inactivo');
    }

    return {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol.nombre,
    };
  }
}