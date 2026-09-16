import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './entities/medico.entity';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(createMedicoDto: CreateMedicoDto) {
    const existe = await this.medicoRepository.findOne({
      where: { tarjetaProfesional: createMedicoDto.tarjetaProfesional },
    });

    if (existe) {
      throw new ConflictException(
        `El médico con la tarjeta profesional "${createMedicoDto.tarjetaProfesional}" ya existe`,
      );
    }

    const medico = this.medicoRepository.create(createMedicoDto);
    const guardado = await this.medicoRepository.save(medico);

    return {
      message: 'Médico registrado exitosamente',
      data: guardado,
    };
  }

  async findAll(): Promise<Medico[]> {
    return await this.medicoRepository.find();
  }

  async findOne(id: number): Promise<Medico> {
    const medico = await this.medicoRepository.findOne({
      where: { id },
    });

    if (!medico) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }

    return medico;
  }

  async update(id: number, updateMedicoDto: UpdateMedicoDto) {
    const medico = await this.findOne(id);

    if (
      updateMedicoDto.tarjetaProfesional &&
      updateMedicoDto.tarjetaProfesional !== medico.tarjetaProfesional
    ) {
      const existe = await this.medicoRepository.findOne({
        where: { tarjetaProfesional: updateMedicoDto.tarjetaProfesional },
      });

      if (existe) {
        throw new ConflictException(
          `La tarjeta profesional "${updateMedicoDto.tarjetaProfesional}" ya está registrada`,
        );
      }
    }

    this.medicoRepository.merge(medico, updateMedicoDto);
    const guardado = await this.medicoRepository.save(medico);

    return {
      message: 'Médico actualizado exitosamente',
      data: guardado,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const medico = await this.findOne(id);
    await this.medicoRepository.remove(medico);

    return {
      message: `Médico "${medico.nombreCompleto}" con ID ${id} eliminado exitosamente`,
    };
  }
}