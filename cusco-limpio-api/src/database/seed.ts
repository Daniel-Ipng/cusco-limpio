import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/usuario.entity';
import { Zona } from '../zonas/zona.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';
import { Horario } from '../horarios/horario.entity';
import { Asignacion } from '../asignaciones/asignacion.entity';

config(); // Carga el .env

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [Usuario, Zona, Vehiculo, Horario, Asignacion], // ← agrega Asignacion
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('🌱 Iniciando seed...');

  // Limpiar tablas en orden correcto (respetando foreign keys)
  await dataSource.query('TRUNCATE TABLE horarios CASCADE');
  await dataSource.query('TRUNCATE TABLE vehiculos CASCADE');
  await dataSource.query('TRUNCATE TABLE usuarios CASCADE');
  await dataSource.query('TRUNCATE TABLE zonas CASCADE');

  // 1. Zonas reales de Cusco
  const zonaRepo = dataSource.getRepository(Zona);
  const zonas = await zonaRepo.save([
    { nombre: 'Centro Histórico', activa: true },
    { nombre: 'Wanchaq', activa: true },
    { nombre: 'Santiago', activa: true },
    { nombre: 'San Sebastián', activa: true },
    { nombre: 'San Jerónimo', activa: true },
  ]);
  console.log('✅ Zonas creadas:', zonas.length);

  // 2. Vehículos de la flota
  const vehiculoRepo = dataSource.getRepository(Vehiculo);
  const vehiculos = await vehiculoRepo.save([
    { placa: 'ABC-001', tipo: 'compactador', estado: 'activo' },
    { placa: 'ABC-002', tipo: 'compactador', estado: 'activo' },
    { placa: 'XYZ-003', tipo: 'volquete', estado: 'activo' },
    { placa: 'XYZ-004', tipo: 'motofurgon', estado: 'mantenimiento' },
  ]);
  console.log('✅ Vehículos creados:', vehiculos.length);

  // 3. Usuarios de prueba
  const usuarioRepo = dataSource.getRepository(Usuario);
  const hash = await bcrypt.hash('admin123', 10);
  const hashConductor = await bcrypt.hash('conductor123', 10);
  const hashCiudadano = await bcrypt.hash('ciudadano123', 10);

  await usuarioRepo.save([
    {
      nombre: 'Administrador Municipal',
      email: 'admin@cusco.gob.pe',
      passwordHash: hash,
      rol: 'admin',
    },
    {
      nombre: 'Juan Quispe',
      email: 'conductor1@cusco.gob.pe',
      passwordHash: hashConductor,
      rol: 'conductor',
    },
    {
      nombre: 'María Huanca',
      email: 'conductor2@cusco.gob.pe',
      passwordHash: hashConductor,
      rol: 'conductor',
    },
    {
      nombre: 'Carlos Mamani',
      email: 'carlos@gmail.com',
      passwordHash: hashCiudadano,
      rol: 'ciudadano',
      zona: zonas[0], // Centro Histórico
    },
    {
      nombre: 'Ana Condori',
      email: 'ana@gmail.com',
      passwordHash: hashCiudadano,
      rol: 'ciudadano',
      zona: zonas[1], // Wanchaq
    },
  ]);
  console.log('✅ Usuarios creados');

  // 4. Horarios por zona (lunes a sábado)
  const horarioRepo = dataSource.getRepository(Horario);
  const horariosData: Partial<Horario>[] = [];;

  // Centro Histórico: lunes, miércoles, viernes — 6am a 10am
  for (const dia of [1, 3, 5]) {
    horariosData.push({
      zona: zonas[0],
      diaSemana: dia,
      horaInicio: '06:00:00',
      horaFin: '10:00:00',
    });
  }

  // Wanchaq: martes, jueves, sábado — 7am a 11am
  for (const dia of [2, 4, 6]) {
    horariosData.push({
      zona: zonas[1],
      diaSemana: dia,
      horaInicio: '07:00:00',
      horaFin: '11:00:00',
    });
  }

  // Santiago: lunes a sábado — 8am a 12pm
  for (const dia of [1, 2, 3, 4, 5, 6]) {
    horariosData.push({
      zona: zonas[2],
      diaSemana: dia,
      horaInicio: '08:00:00',
      horaFin: '12:00:00',
    });
  }

  await horarioRepo.save(horariosData);
  console.log('✅ Horarios creados');

  await dataSource.destroy();
  console.log('🎉 Seed completado exitosamente');
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});