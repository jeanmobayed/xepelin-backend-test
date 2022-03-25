import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesTask } from './invoices.task';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesTask]
})
export class InvoicesModule {}
