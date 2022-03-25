import { Injectable } from '@nestjs/common';
import * as https from 'https';
import { parse } from 'csv-parse';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { RawInvoicesInterface } from 'src/common/interfaces/raw-invoices.interface';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class InvoicesTask {
  private invoiceCsvUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.invoiceCsvUrl = this.configService.get<string>('INVOICE_CSV_URL');
  }

  @Timeout(1000)
  async updateInvoices(): Promise<void> {
    const rawInvoices = await this.getParsedRawInvoices();
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
}
