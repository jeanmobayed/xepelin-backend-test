import { ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  static readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY;

  @ApiProperty()
  readonly message: string;

  constructor(errorMessage: string) {
    super(
      {
        message: errorMessage,
      },
      ValidationException.statusCode,
    );
  }
}
