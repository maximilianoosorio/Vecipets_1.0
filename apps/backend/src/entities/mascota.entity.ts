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
import { Imagen } from './reporte.entity';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ default: 'PERRO' })
  especie: string;

  @Column({ nullable: true })
  raza: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  tamano: string;

  @Column({ nullable: true })
  sexo: string;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Imagen, (imagen) => imagen.mascota)
  imagenes: Imagen[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}