import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ZonasModule } from './zonas/zonas.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { HorariosModule } from './horarios/horarios.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';

@Module({
  imports: [
    // Variables de entorno disponibles globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Solo en desarrollo
      }),
    }),

    AuthModule,
    UsuariosModule,
    ZonasModule,
    VehiculosModule,
    HorariosModule,
    AsignacionesModule,
  ],
})
export class AppModule {}