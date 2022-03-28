import { ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';

export class FailedDependencyException extends HttpException {
  static readonly statusCode = HttpStatus.FAILED_DEPENDENCY;

  @ApiProperty()
  readonly message: string;

  constructor(message: string) {
    super({ message }, FailedDependencyException.statusCode);
  }
}
