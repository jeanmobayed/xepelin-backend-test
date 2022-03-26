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
  @Column({type: 'int'})
  vendorId: number;

  @ApiResponseProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
  invoiceTotal: number;

  @ApiResponseProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
  paymentTotal: number;

  @ApiResponseProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0})
  creditTotal: number;

  @ApiResponseProperty()
  @Column({type: 'int'})
  bankId: number;

  @Column({type: 'date'})
  invoiceDueDate: Date;

  @Column({type: 'date', nullable: true})
  paymentDate?: Date;

  @Column({enum: CurrencyEnum})
  currency: CurrencyEnum;
}
