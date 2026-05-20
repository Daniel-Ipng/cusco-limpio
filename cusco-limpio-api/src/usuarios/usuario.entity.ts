import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Zona } from '../zonas/zona.entity';
import { Asignacion } from '../asignaciones/asignacion.entity';

// @Entity() le dice a TypeORM que esta clase es una tabla en la base de datos
// El nombre de la tabla será 'usuario' por defecto
@Entity('usuarios')
export class Usuario {

  // UUID como clave primaria — más seguro que un número autoincremental
  // porque no expone cuántos usuarios tiene el sistema
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  // unique: true crea un índice único en la base de datos
  // No pueden existir dos usuarios con el mismo email
  @Column({ unique: true, length: 150 })
  email: string;

  // Nunca guardamos la contraseña en texto plano
  // Este campo siempre tendrá el hash de bcrypt
  @Column({ name: 'password_hash' })
  passwordHash: string;

  // El rol determina qué pantallas y endpoints puede usar cada usuario
  // Es un string con valores controlados, no una tabla separada (YAGNI)
  @Column({
    type: 'enum',
    enum: ['ciudadano', 'admin', 'conductor'],
    default: 'ciudadano',
  })
  rol: 'ciudadano' | 'admin' | 'conductor';

  // nullable: true porque el admin no pertenece a ninguna zona
  // Solo los ciudadanos tienen zona asignada
  @ManyToOne(() => Zona, { nullable: true, eager: false })
  @JoinColumn({ name: 'zona_id' })
  zona: Zona;

  // Esta relación permite saber qué asignaciones tiene un conductor
  @OneToMany(() => Asignacion, (asignacion) => asignacion.conductor)
  asignaciones: Asignacion[];

  // TypeORM llena este campo automáticamente al crear el registro
  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}