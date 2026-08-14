import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Mascota } from './mascota.entity';

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mascota, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mascota_id' })
  mascota: Mascota;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'tipo_reporte', length: 20 })
  tipoReporte: string; // 'PERDIDO' o 'ENCONTRADO'

  @Column({ length: 20, default: 'PENDIENTE_APROBACION' })
  estado: string; // 'PENDIENTE_APROBACION', 'PUBLICADO', 'RECHAZADO', 'RESUELTO'

  @Column({ type: 'timestamp with time zone', name: 'fecha_evento' })
  fechaEvento: Date;

  @Column({ type: 'text' })
  descripcion: string;

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

  @ManyToOne(() => Mascota, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'mascota_id' })
  mascota: Mascota;

  @ManyToOne(() => Reporte, (reporte) => reporte.imagenes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'reporte_id' })
  reporte: Reporte;

  @Column({ name: 'url_cloudinary', length: 500 })
  urlCloudinary: string;

  @Column({ name: 'public_id', length: 255 })
  publicId: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}