import { ApiResponseProperty } from '@nestjs/swagger';

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
}
