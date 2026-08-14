import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Fix: Cambiado de '@typeorm/typeorm'
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

import { Usuario, Rol } from '../entities/usuario.entity';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async registrar(registroDto: RegistroDto) {
    const { correo, contrasena, nombre, apellido } = registroDto;

    // 1. Verificar si el correo ya existe
    const usuarioExiste = await this.usuarioRepo.findOne({ where: { correo } });
    if (usuarioExiste) {
      throw new ConflictException('El correo ya se encuentra registrado');
    }

    // 2. Buscar el rol por defecto (CIUDADANO)
    const rolCiudadano = await this.rolRepo.findOne({
  where: { nombre: 'CIUDADANO' },
});
    // 3. Cifrar contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    // 4. Crear entidad y guardar
    // Si no se encuentra el rol, lanzamos excepción
if (!rolCiudadano) {
  throw new NotFoundException('El rol CIUDADANO no fue encontrado.');
}

    const nuevoUsuario = this.usuarioRepo.create({
      nombre,
      apellido,
      correo,
      contrasenaHash,
      rol: rolCiudadano,
    });
    await this.usuarioRepo.save(nuevoUsuario);

    // 5. Enviar email de bienvenida
    this.mailerService
      .sendMail({
        to: correo,
        subject: '¡Bienvenido a VeciPets! 🐾',
        html: `
          <h2>¡Hola ${nombre}!</h2>
          <p>Tu cuenta en VeciPets ha sido creada exitosamente.</p>
        `,
      })
      .catch((err) => console.error('Error enviando email:', err));

    return {
      mensaje: 'Usuario registrado exitosamente',
      usuarioId: nuevoUsuario.id,
    };
  }

  async login(loginDto: LoginDto) {
    const { correo, contrasena } = loginDto;

    // Fix: Uso de objeto para la relación en TypeORM
    const usuario = await this.usuarioRepo.findOne({
      where: { correo, activo: true },
      relations: { rol: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasenaHash!,
    );

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    };
  }
}