import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponse } from '../common/interfaces/generic-response.interface';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsDto } from './dto/list-clients-dto';

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

  async listClients(): Promise<ListClientsDto> {
    const clients = await this.clientsRepository.find();

    return { items: clients };
  }
}
