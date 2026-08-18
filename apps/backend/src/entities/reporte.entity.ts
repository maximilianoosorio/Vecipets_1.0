import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Mascota } from './mascota.entity';

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mascota, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mascota_id' })
  mascota: Mascota;

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'ubicacion_id', nullable: true })
  ubicacionId: string;

  @Column({ name: 'tipo_reporte' })
  tipoReporte: string;

  @Column({ default: 'PUBLICADO' })
  estado: string;

  @Column({ name: 'fecha_evento', type: 'timestamp', nullable: true })
  fechaEvento: Date;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: true })
  latitud: number;

  @Column({ type: 'numeric', precision: 10, scale: 6, nullable: true })
  longitud: number;

  @Column({ nullable: true })
  direccion: string;

  @OneToMany(() => Imagen, (img) => img.reporte, { cascade: true })
  imagenes: Imagen[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

@Entity('imagenes')
export class Imagen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'url_cloudinary' })
  urlCloudinary: string;

  @Column({ name: 'public_id', nullable: true })
  publicId: string;

  @ManyToOne(() => Mascota, (m) => m.imagenes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'mascota_id' })
  mascota: Mascota;

  @ManyToOne(() => Reporte, (r) => r.imagenes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'reporte_id' })
  reporte: Reporte;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}