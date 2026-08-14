import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 30 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true, length: 150 })
  correo: string;

  @Column({ name: 'contrasena_hash', length: 255 })
  contrasenaHash?: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}