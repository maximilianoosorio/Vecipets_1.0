import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const { correo, contrasena, nombre, apellido, telefono, rol } = registroDto;

    // 1. Verificar si el correo ya existe
    const usuarioExiste = await this.usuarioRepo.findOne({ 
      where: { correo: correo.toLowerCase().trim() } 
    });
    
    if (usuarioExiste) {
      throw new ConflictException('El correo ya se encuentra registrado');
    }

    // 2. Buscar el rol solicitado (por defecto CIUDADANO)
    const nombreRol = rol?.toUpperCase() === 'REFUGIO' ? 'REFUGIO' : 'CIUDADANO';
    const rolEntidad = await this.rolRepo.findOne({
      where: { nombre: nombreRol },
    });

    if (!rolEntidad) {
      throw new NotFoundException(`El rol ${nombreRol} no fue encontrado en la base de datos.`);
    }

    // 3. Cifrar contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    // 4. Crear entidad con telefono y guardar en Supabase
    const nuevoUsuario = this.usuarioRepo.create({
      nombre,
      apellido,
      correo: correo.toLowerCase().trim(),
      telefono: telefono || null,
      contrasenaHash,
      rol: rolEntidad,
    });

    await this.usuarioRepo.save(nuevoUsuario);

    // 5. Enviar email de bienvenida (asíncrono sin bloquear la respuesta)
    this.mailerService
      ?.sendMail({
        to: correo,
        subject: '¡Bienvenido a VeciPets! 🐾',
        html: `
          <h2>¡Hola ${nombre}!</h2>
          <p>Tu cuenta en VeciPets ha sido creada exitosamente como <strong>${rolEntidad.nombre}</strong>.</p>
        `,
      })
      .catch((err) => console.error('Error enviando email:', err));

    // 6. Generar JWT para que quede logueado de inmediato
    const payload = {
      sub: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
      rol: rolEntidad.nombre,
    };

    const token = this.jwtService.sign(payload);

    return {
      mensaje: 'Usuario registrado exitosamente',
      access_token: token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        telefono: nuevoUsuario.telefono,
        rol: rolEntidad.nombre,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { correo, contrasena } = loginDto;

    // Buscar usuario activo con su rol
    const usuario = await this.usuarioRepo.findOne({
      where: { correo: correo.toLowerCase().trim(), activo: true },
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
        telefono: usuario.telefono,
        rol: usuario.rol.nombre,
      },
    };
  }
}