import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Asignacion } from '../asignaciones/asignacion.entity';

@Entity('vehiculos')
export class Vehiculo {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Placa del camión — única en todo el sistema
  // Ejemplo: "ABC-123"
  @Column({ unique: true, length: 10 })
  placa: string;

  // Tipo de vehículo como enum
  // No creamos tabla separada porque son valores fijos que no cambian
  @Column({
    type: 'enum',
    enum: ['compactador', 'volquete', 'motofurgon'],
  })
  tipo: 'compactador' | 'volquete' | 'motofurgon';

  // Estado actual del vehículo
  // 'mantenimiento' bloquea que se pueda asignar en el sprint 3
  @Column({
    type: 'enum',
    enum: ['activo', 'mantenimiento'],
    default: 'activo',
  })
  estado: 'activo' | 'mantenimiento';

  @OneToMany(() => Asignacion, (asignacion) => asignacion.vehiculo)
  asignaciones: Asignacion[];
}