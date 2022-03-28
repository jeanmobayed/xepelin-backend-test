import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from '../common/interfaces/generic-response.interface';
import { ClientEntity } from './client.entity';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
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
    type: ClientEntity,
    isArray: true,
  })
  async listClients(): Promise<ClientEntity[]> {
    return await this.clientsService.listClients();
  }

  @Post()
  @ApiOperation({
    description: 'Create a client',
  })
  @ApiOkResponse({
    type: GenericResponse,
  })
  @ApiBadRequestResponse({
    type: GenericResponse,
  })
  async createClient(@Body() createClientDto: CreateClientDto): Promise<GenericResponse> {
    return await this.clientsService.createClient(createClientDto);
  }

  @Patch('/:id')
  @ApiOperation({
    description: 'Update a client',
  })
  @ApiOkResponse({
    type: GenericResponse,
  })
  @ApiBadRequestResponse({
    type: GenericResponse,
  })
  @ApiNotFoundResponse({
    type: GenericResponse,
  })
  async updateClient(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto): Promise<GenericResponse> {
    return await this.clientsService.updateClient(id, updateClientDto);
  }

  @Delete('/:id')
  @ApiOperation({
    description: 'Delete a client',
  })
  @ApiOkResponse({
    type: GenericResponse,
  })
  @ApiNotFoundResponse({
    type: GenericResponse,
  })
  async deleteClient(@Param('id') id: number): Promise<GenericResponse> {
    return await this.clientsService.deleteClient(id);
  }
}
