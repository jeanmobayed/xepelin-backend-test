import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from '../common/interfaces/generic-response.interface';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsDto } from './dto/list-clients-dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({
    description: 'Lists all clients',
  })
  @ApiOkResponse({
    type: ListClientsDto,
  })
  async listClients(): Promise<ListClientsDto> {
    return await this.clientsService.listClients();
  }

  @Post()
  @ApiOperation({
    description: 'Create a client',
  })
  @ApiOkResponse({
    type: GenericResponse,
  })
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<GenericResponse> {
    return await this.clientsService.createClient(createClientDto);
  }
}
