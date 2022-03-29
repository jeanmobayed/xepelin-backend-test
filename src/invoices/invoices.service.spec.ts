import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CurrencyEnum } from '../common/enums/currency.enum';
import { MoreThanOrEqual, ObjectLiteral, Repository } from 'typeorm';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';
import { InvoiceEntity } from './invoice.entity';
import { InvoicesService } from './invoices.service';
import axios from 'axios';
import { ConversionPairsInterface } from '../common/interfaces/conversion-pairs.interface';
import { FailedDependencyException } from '../common/exceptions/failed-dependency.exception';

describe('InvoicesService', () => {
  let InvoiceService: InvoicesService;
  let InvoiceRepository: Repository<InvoiceEntity>;

  const axiosResponse: ConversionPairsInterface = {
    USD_EUR: 0.1,
    USD_CLP: 0.1,
    EUR_USD: 0.1,
    EUR_CLP: 0.1,
    CLP_USD: 0.1,
    CLP_EUR: 0.1,
  };

  jest.mock('axios', () => {
    return Object.assign(jest.fn(), {
      get: jest.fn(),
    });
  });

  const getCacheSpy = jest.fn().mockReturnValueOnce(null);

  const mockCacheManager = {
    set: jest.fn(),
    get: getCacheSpy,
  };

  const mockConfigurationService = {
    get: jest.fn(),
  };

  const mockedInvoices = [
    {
      invoiceId: 60,
      invoiceNumber: '963253240',
      vendorId: 123,
      invoiceTotal: 57357.34,
      paymentTotal: 57357.34,
      creditTotal: 0,
      bankId: 1,
    },
    {
      invoiceId: 61,
      invoiceNumber: '963253239',
      vendorId: 123,
      invoiceTotal: 126057.74,
      paymentTotal: 126057.74,
      creditTotal: 0,
      bankId: 1,
    },
  ];

  const whereSpy = jest.fn().mockReturnThis();
  const selectSpy = jest.fn().mockReturnThis();
  const getManySpy = jest.fn().mockReturnValueOnce(mockedInvoices);

  const mockInvoiceRepository = jest.fn(() => ({
    createQueryBuilder: jest.fn(() => ({
      where: whereSpy,
      getMany: getManySpy,
      select: selectSpy,
    })),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        InvoicesService,
        {
          provide: getRepositoryToken(InvoiceEntity),
          useFactory: mockInvoiceRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: ConfigService,
          useValue: mockConfigurationService,
        },
      ],
    }).compile();

    InvoiceService = await module.get<InvoicesService>(InvoicesService);
    InvoiceRepository = module.get<Repository<InvoiceEntity>>(getRepositoryToken(InvoiceEntity));
  });

  describe('listInvoices', () => {
    it('Should list invoices considering filters', async () => {
      expect(InvoiceRepository.createQueryBuilder).not.toHaveBeenCalled();

      jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ status: 200, data: axiosResponse }));

      const filters: InvoiceFiltersDto = {
        vendor: 123,
        invoice_date: '23-MAY-2014',
        targetCurrency: CurrencyEnum.USD,
      };

      const result = await InvoiceService.listInvoices(filters);

      const where: ObjectLiteral = {
        vendorId: filters.vendor,
        invoiceDate: MoreThanOrEqual(new Date(filters.invoice_date)),
      };

      expect(InvoiceRepository.createQueryBuilder).toHaveBeenCalled();

      expect(whereSpy).toHaveBeenCalledWith(where);

      expect(getManySpy).toHaveBeenCalled();

      expect(result).toEqual(mockedInvoices);
    });

    it('Should throw an error if currency conversion service fails', async () => {
      expect(InvoiceRepository.createQueryBuilder).not.toHaveBeenCalled();

      jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({ status: 401, data: axiosResponse }));

      const filters: InvoiceFiltersDto = {
        vendor: 123,
        invoice_date: '23-MAY-2014',
        targetCurrency: CurrencyEnum.USD,
      };

      expect(InvoiceService.listInvoices(filters)).rejects.toThrow(FailedDependencyException);
    });
  });
});
