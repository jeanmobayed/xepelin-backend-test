import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';
import { ListInvoicesDto } from './dto/list-invoices.dto';
import { InvoiceEntity } from './invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoicesRepository: Repository<InvoiceEntity>,
  ) {}

  async listInvoices(filters: InvoiceFiltersDto): Promise<ListInvoicesDto[]> {
    console.log(filters);

    const invoices = await this.invoicesRepository
      .createQueryBuilder('invoice')
      .select([
        'invoice.invoiceId',
        'invoice.invoiceNumber',
        'invoice.vendorId',
        'invoice.invoiceTotal',
        'invoice.paymentTotal',
        'invoice.creditTotal',
        'invoice.bankId',
      ])
      .getMany();

    return invoices;
  }
}
