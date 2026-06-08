import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamionesService } from './camiones.service';
import { CamionesController } from './camiones.controller';
import { Camion } from './entities/camion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Camion])],
  controllers: [CamionesController],
  providers: [CamionesService],
  exports: [CamionesService],
})
export class CamionesModule {}