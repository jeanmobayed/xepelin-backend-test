import { ApiResponseProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../../common/enums/currency.enum';

export class ListInvoicesDto {
  @ApiResponseProperty()
  invoiceId: number;

  @ApiResponseProperty()
  invoiceNumber: string;

  @ApiResponseProperty()
  vendorId: number;

  @ApiResponseProperty()
  invoiceTotal: number;

  @ApiResponseProperty()
  paymentTotal: number;

  @ApiResponseProperty()
  creditTotal: number;

  @ApiResponseProperty()
  bankId: number;

  currency?: CurrencyEnum;
}
