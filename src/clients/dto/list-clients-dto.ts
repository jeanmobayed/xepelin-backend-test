import { ApiResponseProperty } from '@nestjs/swagger';
import { ClientEntity } from '../client.entity';

export class ListClientsDto {
  @ApiResponseProperty({ type: [ClientEntity] })
  items: ClientEntity[];
}