import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, ObjectLiteral, Repository } from 'typeorm';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';
import { ListInvoicesDto } from './dto/list-invoices.dto';
import { InvoiceEntity } from './invoice.entity';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CurrencyEnum } from '../common/enums/currency.enum';
import { ConversionPairsInterface } from '../common/interfaces/conversion-pairs.interface';
import { roundToTwoDecimals } from '../common/helpers/round-to-two';

@Injectable()
export class InvoicesService {
  private readonly currencyConverterApiUrl: string;
  private readonly currencyConverterApiKey: string;
  private readonly currencyConverterApiUrlEndpoint = '/api/v7/convert';
  private readonly currencyConverterApiUrlConstants = '&compact=ultra&apiKey=';

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(InvoiceEntity)
    private readonly invoicesRepository: Repository<InvoiceEntity>,
  ) {
    this.currencyConverterApiUrl = this.configService.get<string>(
      'CURRENCY_CONVERTER_API_URL',
    );
    this.currencyConverterApiKey = this.configService.get<string>(
      'CURRENCY_CONVERTER_API_KEY',
    );
  }

  async listInvoices(filters: InvoiceFiltersDto): Promise<ListInvoicesDto[]> {
    const where: ObjectLiteral = {};

    console.log(filters);

    if (filters.vendor) where.vendorId = filters.vendor;

    if (filters.invoice_date)
      where.invoiceDate = MoreThanOrEqual(new Date(filters.invoice_date));

    console.log(where);

    const invoices = await this.invoicesRepository
      .createQueryBuilder('invoice')
      .select([
        'invoice.invoiceId',
        'invoice.invoiceDate',
        'invoice.invoiceNumber',
        'invoice.vendorId',
        'invoice.invoiceTotal',
        'invoice.paymentTotal',
        'invoice.creditTotal',
        'invoice.bankId',
        'invoice.currency'
      ])
      .where(where)
      .getMany();

    return await this.parseInvoiceAmounts(invoices, filters.targetCurrency);
  }

  private async parseInvoiceAmounts(invoices: ListInvoicesDto[], targetCurrency: CurrencyEnum): Promise<ListInvoicesDto[]>{
    const mappedInvoices: ListInvoicesDto[] = []

    const conversionPairs = await this.getAllConversionPairs();

    for(const invoice of invoices){
      if(targetCurrency && targetCurrency !== invoice.currency){
        const conversionRate: number = conversionPairs[`${invoice.currency}_${targetCurrency}`];

        invoice.creditTotal = roundToTwoDecimals(invoice.creditTotal*conversionRate);
        invoice.invoiceTotal = roundToTwoDecimals(invoice.invoiceTotal*conversionRate);
        invoice.paymentTotal = roundToTwoDecimals(invoice.paymentTotal*conversionRate);
      }

      delete invoice.currency;
      mappedInvoices.push(invoice);
    }

    return mappedInvoices;
  }

  private async getAllConversionPairs(): Promise<ConversionPairsInterface>{

    const cachedPairs = await this.cacheManager.get('conversionPairs') as ConversionPairsInterface;

    if(cachedPairs) return cachedPairs;

    const usdPairsPromise = this.fetchConversionRatesFromCurrency(CurrencyEnum.USD, [
      CurrencyEnum.CLP,
      CurrencyEnum.EUR,
    ]);

    const eurPairsPromise = this.fetchConversionRatesFromCurrency(CurrencyEnum.EUR, [
      CurrencyEnum.USD,
      CurrencyEnum.CLP,
    ]);

    const clpPairsPromise = this.fetchConversionRatesFromCurrency(CurrencyEnum.CLP, [
      CurrencyEnum.USD,
      CurrencyEnum.EUR,
    ]);

    const [usdPairs, eurPairs, clpPairs] = await Promise.all([usdPairsPromise, eurPairsPromise, clpPairsPromise]);
    
    const allPairs = {...usdPairs, ...eurPairs, ...clpPairs} as ConversionPairsInterface;

    await this.cacheManager.set('conversionPairs', allPairs, { ttl: 3600 });

    return allPairs;
  }

  private async fetchConversionRatesFromCurrency(
    fromCurrency: CurrencyEnum,
    toCurrency: [CurrencyEnum, CurrencyEnum],
  ): Promise<Partial<ConversionPairsInterface>> {
    const query = `?q=${fromCurrency}_${toCurrency[0]},${fromCurrency}_${toCurrency[1]}`;

    try {
      const { data: conversionRates } = await axios.get(
        `${
          this.currencyConverterApiUrl +
          this.currencyConverterApiUrlEndpoint +
          query +
          this.currencyConverterApiUrlConstants +
          this.currencyConverterApiKey
        }`,
      );

      return conversionRates;
    } catch (err) {
      throw new InternalServerErrorException(
        'We are unable to provide the currency conversion service right now. Please try again later.',
      );
    }
  }
}
