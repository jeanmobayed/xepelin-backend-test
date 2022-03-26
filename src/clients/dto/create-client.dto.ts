import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../../common/enums/currency.enum';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  internalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taxId: string;

  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: CurrencyEnum})
  currency: CurrencyEnum;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  apiQuota: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  allowedBanks: number[];
}
