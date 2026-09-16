import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CitaMedica } from '../../citas/entities/cita.entity';

@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombreCompleto: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  tarjetaProfesional: string;

  @Column({ type: 'varchar', length: 100 })
  especialidad: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => CitaMedica, (cita) => cita.medico)
  citas: CitaMedica[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}