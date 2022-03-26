import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../common/enums/currency.enum';

@Entity('Clients')
export class ClientEntity {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty()
  @Column()
  internalCode: string;

  @ApiResponseProperty()
  @Column()
  taxId: string;

  @ApiResponseProperty({ enum: CurrencyEnum})
  @Column({enum: CurrencyEnum})
  currency: CurrencyEnum;

  @ApiResponseProperty()
  @Column()
  apiQuota: number;

  @ApiResponseProperty()
  @Column({type: 'json'})
  allowedBanks: string;
}
