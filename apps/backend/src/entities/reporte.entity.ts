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
import { Mascota } from './mascota.entity';
import { Usuario } from './usuario.entity';

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tipo_reporte', type: 'varchar', length: 50 })
  tipoReporte: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ name: 'fecha_evento', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaEvento: Date;

  @Column({ type: 'varchar', length: 50, default: 'PUBLICADO' })
  estado: string;

  // 👉 Columnas de Ubicación necesarias para Leaflet
  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  latitud: number;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  longitud: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @ManyToOne(() => Mascota, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mascota_id' })
  mascota: Mascota;

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Imagen, (imagen) => imagen.reporte, { cascade: true })
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

  @Column({ name: 'url_cloudinary', type: 'text' })
  urlCloudinary: string;

  @Column({ name: 'public_id', type: 'varchar', length: 255, nullable: true })
  publicId: string;

  @ManyToOne(() => Mascota, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mascota_id' })
  mascota: Mascota;

  @ManyToOne(() => Reporte, (reporte) => reporte.imagenes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporte_id' })
  reporte: Reporte;
}