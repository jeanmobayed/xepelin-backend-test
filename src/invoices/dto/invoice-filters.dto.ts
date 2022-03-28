import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { CurrencyEnum } from '../../common/enums/currency.enum';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidDateFormat } from 'src/common/decorators/is-valid-date-format.decorator';

export class InvoiceFiltersDto {
  @ApiPropertyOptional({ description: 'Allows to filter invoices by vendor' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  vendor?: number;

  @ApiPropertyOptional({ description: 'Allows to filter invoices starting from a given date' })
  @IsString()
  @IsValidDateFormat({ message: 'invoice_date format must be DD-MMM-YYYY, DD/MMM/YYYY or DD.MMM.YYYY. Example: 25-JAN-2022' })
  @IsOptional()
  invoice_date?: string;

  @ApiPropertyOptional({ enum: CurrencyEnum, description: 'Converts the invoice amounts to the desired currency' })
  @IsEnum(CurrencyEnum)
  @IsOptional()
  targetCurrency?: CurrencyEnum;
}
