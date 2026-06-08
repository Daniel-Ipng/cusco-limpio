import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Camion } from '../../camiones/entities/camion.entity';

@Entity('rutas')
export class Ruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50 })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaProgramada: Date;

  @Column({ type: 'float', nullable: true })
  distanciaKm: number;

  @ManyToOne(() => Camion, { nullable: true })
  camion: Camion;
}