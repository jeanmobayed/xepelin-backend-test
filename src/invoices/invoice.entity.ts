import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../common/enums/currency.enum';

@Entity('Invoices')
export class InvoiceEntity {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  invoiceId: number;

  @ApiResponseProperty()
  @Column()
  invoiceNumber: string;

  @Column({type: 'date'})
  invoiceDate: Date;

  @ApiResponseProperty()
  @Column()
  vendorId: string;

  @ApiResponseProperty()
  @Column()
  invoiceTotal: number;

  @ApiResponseProperty()
  @Column()
  paymentTotal: number;

  @ApiResponseProperty()
  @Column()
  creditTotal: number;

  @ApiResponseProperty()
  @Column()
  bankId: number;

  @Column({type: 'date'})
  invoiceDueDate: Date;

  @Column({type: 'date', nullable: true})
  paymentDate: Date;

  @Column({enum: CurrencyEnum})
  currency: CurrencyEnum;
}
