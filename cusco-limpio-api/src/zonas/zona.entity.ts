import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Horario } from '../horarios/horario.entity';
import { Asignacion } from '../asignaciones/asignacion.entity';

@Entity('zonas')
export class Zona {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Ejemplo: "Centro Histórico", "Wanchaq", "Santiago"
  @Column({ length: 100 })
  nombre: string;

  // Borrado lógico — cuando el admin "elimina" una zona,
  // en realidad solo cambia activa a false
  // Los datos históricos se conservan para los reportes del sprint 4
  @Column({ default: true })
  activa: boolean;

  // Una zona tiene muchos horarios (lunes diferente a martes, etc.)
  @OneToMany(() => Horario, (horario) => horario.zona)
  horarios: Horario[];

  // Una zona tiene muchas asignaciones a lo largo del tiempo
  @OneToMany(() => Asignacion, (asignacion) => asignacion.zona)
  asignaciones: Asignacion[];
}