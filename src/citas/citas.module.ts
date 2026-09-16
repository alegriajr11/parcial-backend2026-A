import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { CitaMedica } from './entities/cita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CitaMedica])],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}