import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitaMedica } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { MedicosService } from '../medicos/medicos.service';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(CitaMedica)
    private readonly citaRepository: Repository<CitaMedica>,
    private readonly medicosService: MedicosService,
  ) {}

  async create(createCitaDto: CreateCitaDto) {
    const { medicoId, ...citaData } = createCitaDto;

    const medico = await this.medicosService.findOne(medicoId);

    const cita = this.citaRepository.create({
      ...citaData,
      medico,
    });

    const guardada = await this.citaRepository.save(cita);

    return {
      message: 'Cita médica registrada exitosamente',
      data: guardada,
    };
  }

  async findAll(): Promise<CitaMedica[]> {
    return await this.citaRepository.find({
      relations: { medico: true },
    });
  }

  async findOne(id: number): Promise<CitaMedica> {
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: { medico: true },
    });

    if (!cita) {
      throw new NotFoundException(`Cita médica con ID ${id} no encontrada`);
    }

    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto) {
    const cita = await this.findOne(id);
    const { medicoId, ...citaData } = updateCitaDto;

    if (medicoId) {
      const medico = await this.medicosService.findOne(medicoId);
      cita.medico = medico;
    }

    this.citaRepository.merge(cita, citaData);
    const guardada = await this.citaRepository.save(cita);

    return {
      message: 'Cita médica actualizada exitosamente',
      data: guardada,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const cita = await this.findOne(id);
    await this.citaRepository.remove(cita);

    return {
      message: `Cita médica con ID ${id} eliminada exitosamente`,
    };
  }
}