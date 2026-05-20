import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Zona } from '../zonas/zona.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { Usuario } from '../usuarios/usuario.entity';

// Esta es la tabla más importante del MVP
// Responde la pregunta: "¿Qué camión, manejado por quién,
// va a qué zona, en qué fecha?"
@Entity('asignaciones')
export class Asignacion {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Zona, (zona) => zona.asignaciones)
  @JoinColumn({ name: 'zona_id' })
  zona: Zona;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.asignaciones)
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo;

  // Solo usuarios con rol 'conductor' deberían asignarse aquí
  // Esa validación la hacemos en el servicio, no en la entidad
  @ManyToOne(() => Usuario, (usuario) => usuario.asignaciones)
  @JoinColumn({ name: 'conductor_id' })
  conductor: Usuario;

  // Fecha específica de esta asignación
  // Separada del horario porque el horario es el plan semanal
  // y la asignación es la ejecución real de un día concreto
  @Column({ type: 'date' })
  fecha: string;

  // El estado permite monitorear el camión en tiempo real (MVP)
  // y en sprint 2 se actualiza automáticamente con el GPS
  @Column({
    type: 'enum',
    enum: ['programada', 'en_curso', 'completada', 'cancelada'],
    default: 'programada',
  })
  estado: 'programada' | 'en_curso' | 'completada' | 'cancelada';

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}