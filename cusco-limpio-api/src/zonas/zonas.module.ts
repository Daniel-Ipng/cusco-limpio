import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonasController } from './zonas.controller';
import { ZonasService } from './zonas.service';
import { Zona } from './zona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zona])],
  controllers: [ZonasController],
  providers: [ZonasService],
  exports: [ZonasService],
})
export class ZonasModule {}