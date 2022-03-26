import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyEnum } from '../../common/enums/currency.enum';
import { Transform, Type } from 'class-transformer';

export class InvoiceFiltersDto {
  @Type(() => Number)
  @IsInt()  
  @IsOptional()
  vendor?: number;

  @IsDateString()
  @IsOptional()
  invoice_date?: string;

  @IsEnum(CurrencyEnum)
  @IsOptional()
  targetCurrency?: CurrencyEnum;
}
