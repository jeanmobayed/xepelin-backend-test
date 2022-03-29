import { ArrayMaxSize, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../../common/enums/currency.enum';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  internalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  taxId: string;

  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: CurrencyEnum })
  currency: CurrencyEnum;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Max(2147483647)
  apiQuota: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(50)
  allowedBanks: number[];
}
