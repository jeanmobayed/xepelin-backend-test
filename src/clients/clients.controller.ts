import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { ValidationException } from '../common/exceptions/validation.exception';
import { GenericResponse } from '../common/interfaces/generic-response.interface';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsDto } from './dto/list-clients-dto';
import { UpdateClientDto } from './dto/update-client.dto';

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
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<GenericResponse> {
    return await this.clientsService.createClient(createClientDto);
  }

  @Patch('/:id')
  @ApiOperation({
    description: 'Update a client',
  })
  @ApiOkResponse({
    type: GenericResponse,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiNotFoundResponse({
    type: ValidationException,
  })
  async updateClient(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<GenericResponse> {
    return await this.clientsService.updateClient(id, updateClientDto);
  }
}
