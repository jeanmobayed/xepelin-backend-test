import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../common/enums/currency.enum';

@Entity('Clients')
export class ClientEntity {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty()
  @Column('varchar', { length: 50 })
  internalCode: string;

  @ApiResponseProperty()
  @Column('varchar', { length: 50 })
  companyName: string;

  @ApiResponseProperty()
  @Column('varchar', { length: 50 })
  taxId: string;

  @ApiResponseProperty({ enum: CurrencyEnum })
  @Column()
  currency: CurrencyEnum;

  @ApiResponseProperty()
  @Column()
  apiQuota: number;

  @ApiResponseProperty()
  @Column({ type: 'json' })
  allowedBanks: string;
}
