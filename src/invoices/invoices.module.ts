import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './invoice.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesTask } from './invoices.task';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesTask],
})
export class InvoicesModule {}
