import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('zonas')
export class Zona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;
}