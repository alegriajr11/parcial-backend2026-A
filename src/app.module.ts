import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MedicosModule } from './medicos/medicos.module';
import { CitasModule } from './citas/citas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MedicosModule,
    CitasModule,
  ],
})
export class AppModule {}