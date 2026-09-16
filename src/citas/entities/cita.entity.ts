import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';

@Entity('citas')
export class CitaMedica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  pacienteNombre: string;

  @Column({ type: 'varchar', length: 100 })
  pacienteCorreo: string;

  @Column({ type: 'text' })
  motivoConsulta: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;

  @ManyToOne(() => Medico, (medico) => medico.citas, {
    onDelete: 'CASCADE',
  })
  medico: Medico;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}