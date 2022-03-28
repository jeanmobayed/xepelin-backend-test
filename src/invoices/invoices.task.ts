import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as https from 'https';
import { parse } from 'csv-parse';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { RawInvoicesInterface } from 'src/common/interfaces/raw-invoices.interface';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { InvoiceEntity } from './invoice.entity';
import { CurrencyEnum } from 'src/common/enums/currency.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class InvoicesTask {
  private readonly invoiceCsvUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(InvoiceEntity)
    private readonly invoicesRepository: Repository<InvoiceEntity>,
  ) {
    this.invoiceCsvUrl = this.configService.get<string>('INVOICE_CSV_URL');
  }

  @Timeout(1000)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateInvoices(): Promise<void> {
    const rawInvoices = await this.getParsedRawInvoices();
    const mappedInvoices = this.mapInvoices(rawInvoices);
    await this.invoicesRepository.save(mappedInvoices);
    await this.cacheManager.reset();
  }

  private async getParsedRawInvoices(): Promise<RawInvoicesInterface[]> {
    const rawInvoices: RawInvoicesInterface[] = [];

    return new Promise((resolve, reject) => {
      https
        .request(this.invoiceCsvUrl, (response: IncomingMessage) => {
          response
            .pipe(
              parse({
                trim: true,
                columns: true,
                delimiter: ',',
                skip_empty_lines: true,
              }),
            )
            .on('data', (row: RawInvoicesInterface) => {
              rawInvoices.push(row);
            })
            .on('end', () => {
              resolve(rawInvoices);
            });
        })
        .end();
    });
  }

  private mapInvoices(rawInvoices: RawInvoicesInterface[]): InvoiceEntity[] {
    return rawInvoices.map((rawInvoice) => ({
      invoiceId: parseInt(rawInvoice.INVOICE_ID),
      invoiceNumber: rawInvoice.INVOICE_NUMBER,
      invoiceDate: new Date(rawInvoice.INVOICE_DATE),
      vendorId: parseInt(rawInvoice.VENDOR_ID),
      invoiceTotal: parseFloat(rawInvoice.INVOICE_TOTAL),
      paymentTotal: parseFloat(rawInvoice.PAYMENT_TOTAL),
      creditTotal: parseFloat(rawInvoice.CREDIT_TOTAL),
      bankId: parseInt(rawInvoice.BANK_ID),
      invoiceDueDate: new Date(rawInvoice.INVOICE_DUE_DATE),
      paymentDate: rawInvoice.PAYMENT_DATE ? new Date(rawInvoice.PAYMENT_DATE) : null,
      currency: CurrencyEnum[rawInvoice.CURRENCY],
    }));
  }
}
