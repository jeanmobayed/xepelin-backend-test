import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';
import { ListInvoicesDto } from './dto/list-invoices.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({
    description: 'Lists all invoices',
  })
  @ApiOkResponse({
    type: ListInvoicesDto,
    isArray: true,
  })
  async listInvoices(@Query() filters: InvoiceFiltersDto): Promise<ListInvoicesDto[]> {
    return await this.invoicesService.listInvoices(filters);
  }
}
