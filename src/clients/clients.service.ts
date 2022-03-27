import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponse } from '../common/interfaces/generic-response.interface';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientsRepository: Repository<ClientEntity>,
  ) {}

  async createClient(
    createClientDto: CreateClientDto,
  ): Promise<GenericResponse> {
    const allowedBanks = JSON.stringify(createClientDto.allowedBanks);

    await this.clientsRepository.save({ ...createClientDto, allowedBanks });

    return { message: 'Client created successfuly' };
  }

  async updateClient(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<GenericResponse> {
    const client = await this.clientsRepository.findOne(id);

    if (!client)
      throw new NotFoundException({ message: 'The client was not found.' });

    const { taxId, currency } = updateClientDto;

    await this.clientsRepository.save({ ...client, taxId, currency });

    return { message: 'Client updated successfuly' };
  }

  async listClients(): Promise<ClientEntity[]> {
    return await this.clientsRepository.find();
  }

  async deleteClient(id: number): Promise<GenericResponse> {
    const client = await this.clientsRepository.findOne(id);

    if (!client)
      throw new NotFoundException({ message: 'The client was not found.' });

    await this.clientsRepository.delete(id);

    return { message: 'Client deleted successfuly' };
  }
}
