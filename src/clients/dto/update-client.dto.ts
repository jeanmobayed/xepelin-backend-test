import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyEnum } from '../../common/enums/currency.enum';

export class UpdateClientDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ enum: CurrencyEnum })
  @IsEnum(CurrencyEnum)
  @IsOptional()
  currency?: CurrencyEnum;
}
