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

  // 1. REGISTRO
  async registrar(registroDto: RegistroDto) {
    const rawDto = registroDto as any;
    const correoRaw = rawDto.correo || rawDto.email;
    const passwordRaw = rawDto.contrasena || rawDto.password;
    const nombre = rawDto.nombre?.trim() || '';
    const apellido = rawDto.apellido?.trim() || '';
    const telefono = rawDto.telefono || null;
    const rol = rawDto.rol;

    if (!correoRaw || !passwordRaw) {
      throw new UnauthorizedException('Correo y contraseña son obligatorios');
    }

    const emailNormalizado = correoRaw.toLowerCase().trim();

    // 1. Verificar si el correo ya existe
    const usuarioExiste = await this.usuarioRepo.findOne({ 
      where: { correo: emailNormalizado },
    });
    
    if (usuarioExiste) {
      throw new ConflictException('El correo ya se encuentra registrado');
    }

    // 2. Buscar el rol (por defecto CIUDADANO)
    const nombreRol = (rol?.toUpperCase() === 'REFUGIO') ? 'REFUGIO' : 'CIUDADANO';
    let rolEntidad = await this.rolRepo.findOne({
      where: { nombre: nombreRol },
    });

    if (!rolEntidad) {
      rolEntidad = await this.rolRepo.findOne({ where: { nombre: 'CIUDADANO' } });
    }

    // 3. Cifrar contraseña
    const contrasenaHash = await bcrypt.hash(passwordRaw, 10);

    // 4. Crear entidad con activo: true garantizado
    const nuevoUsuario = this.usuarioRepo.create({
      nombre,
      apellido,
      correo: emailNormalizado,
      telefono,
      contrasenaHash,
      rol: rolEntidad,
      activo: true, // 👈 SOLUCIÓN CLAVE: Siempre activo al registrarse
    } as any);

    const usuarioGuardado: any = await this.usuarioRepo.save(nuevoUsuario);

    // 5. Enviar email de bienvenida
    try {
      this.mailerService
        ?.sendMail({
          to: emailNormalizado,
          subject: '¡Bienvenido a VeciPets! 🐾',
          html: `
            <h2>¡Hola ${nombre}!</h2>
            <p>Tu cuenta en VeciPets ha sido creada exitosamente como <strong>${rolEntidad?.nombre || 'CIUDADANO'}</strong>.</p>
          `,
        })
        .catch((err) => console.error('Error enviando email:', err));
    } catch (e) {
      console.warn('Mailer no configurado o error al enviar:', e);
    }

    // 6. Generar JWT
    const payload = {
      sub: usuarioGuardado.id,
      correo: usuarioGuardado.correo,
      email: usuarioGuardado.correo,
      rol: rolEntidad?.nombre || 'CIUDADANO',
    };

    const token = this.jwtService.sign(payload);

    return {
      mensaje: 'Usuario registrado exitosamente',
      access_token: token,
      token: token,
      usuario: {
        id: usuarioGuardado.id,
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        correo: usuarioGuardado.correo,
        email: usuarioGuardado.correo,
        telefono: usuarioGuardado.telefono,
        rol: rolEntidad?.nombre || 'CIUDADANO',
      },
    };
  }

  // 2. LOGIN
  async login(loginDto: LoginDto) {
    const rawDto = loginDto as any;
    const correoRaw = rawDto.correo || rawDto.email;
    const passwordRaw = rawDto.contrasena || rawDto.password;

    if (!correoRaw || !passwordRaw) {
      throw new UnauthorizedException('Debes ingresar correo y contraseña');
    }

    const emailNormalizado = correoRaw.toLowerCase().trim();

   // Buscar usuario por correo o email en Supabase
    const usuario: any = await this.usuarioRepo.findOne({
      where: [
        { correo: emailNormalizado },
        { email: emailNormalizado } as any,
      ],
      relations: { rol: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas (correo no encontrado)');
    }

    if (usuario.activo === false) {
      throw new UnauthorizedException('Tu cuenta se encuentra inactiva. Contacta a soporte.');
    }

    const hash = usuario.contrasenaHash || usuario.contrasena_hash || usuario.password;
    if (!hash) {
      throw new UnauthorizedException('Error en las credenciales de la cuenta');
    }

    const contrasenaValida = await bcrypt.compare(passwordRaw, hash);

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas (contraseña incorrecta)');
    }

    const rolNombre = usuario.rol?.nombre || (typeof usuario.rol === 'string' ? usuario.rol : 'CIUDADANO');

    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      email: usuario.correo,
      rol: rolNombre,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        email: usuario.correo,
        telefono: usuario.telefono,
        rol: rolNombre,
      },
    };
  }
}