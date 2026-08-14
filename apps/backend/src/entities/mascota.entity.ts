import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ length: 50, nullable: true })
  nombre: string;

  @Column({ length: 30 })
  especie: string; // Perro, Gato, etc.

  @Column({ length: 50, nullable: true })
  raza: string;

  @Column({ length: 50 })
  color: string;

  @Column({ length: 20 })
  tamano: string; // Pequeño, Mediano, Grande

  @Column({ length: 10 })
  sexo: string;

  @Column({ type: 'text', name: 'caracteristicas_especiales', nullable: true })
  caracteristicasEspeciales: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}