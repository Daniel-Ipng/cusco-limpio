import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Zona } from '../zonas/zona.entity';

@Entity('horarios')
export class Horario {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con zona — cada horario pertenece a una zona
  @ManyToOne(() => Zona, (zona) => zona.horarios)
  @JoinColumn({ name: 'zona_id' })
  zona: Zona;

  // Día de la semana: 0=domingo, 1=lunes, ..., 6=sábado
  // Convención estándar de JavaScript (igual que Date.getDay())
  // Esto permite consultar "¿qué horario tiene mi zona hoy?"
  @Column({ name: 'dia_semana' })
  diaSemana: number;

  // Guardamos solo la hora, no la fecha completa
  // Ejemplo: "06:00:00", "10:00:00"
  @Column({ type: 'time', name: 'hora_inicio' })
  horaInicio: string;

  @Column({ type: 'time', name: 'hora_fin' })
  horaFin: string;
}