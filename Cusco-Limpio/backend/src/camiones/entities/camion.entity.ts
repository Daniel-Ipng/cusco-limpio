import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('camiones')
export class Camion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  placa: string;

  @Column({ length: 100 })
  modelo: string;

  @Column({ type: 'float' })
  capacidadKg: number;

  @Column({ length: 50 })
  estado: string;

  @Column({ type: 'float', nullable: true })
  latitud: number;

  @Column({ type: 'float', nullable: true })
  longitud: number;
}