import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CurrencyEnum } from '../../common/enums/currency.enum';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceFiltersDto {
  @ApiPropertyOptional({ description: 'Allows to filter invoices by vendor' })
  @Type(() => Number)
  @IsInt()  
  @IsOptional()
  vendor?: number;

  @ApiPropertyOptional({ description: 'Allows to filter invoices starting from a given date' })
  @IsString()
  @IsOptional()
  invoice_date?: string;

  @ApiPropertyOptional({ enum: CurrencyEnum, description:'Converts the invoice amounts to the desired currency' })
  @IsEnum(CurrencyEnum)
  @IsOptional()
  targetCurrency?: CurrencyEnum;
}
