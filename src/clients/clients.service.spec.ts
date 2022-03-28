import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientEntity } from './client.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CurrencyEnum } from '../common/enums/currency.enum';

describe('ClientService', () => {
  let ClientService: ClientsService;
  let ClientRepository: Repository<ClientEntity>;

  const mockClientsRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  const mockClient: ClientEntity = {
    id: 1,
    companyName: 'Instagram',
    internalCode: 'IG001',
    taxId: 'T-IG0001-2',
    currency: CurrencyEnum.USD,
    apiQuota: 1500,
    allowedBanks: JSON.stringify([1, 2, 4]),
  }

  beforeEach(async () => {
    let repo: Repository<ClientEntity>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(ClientEntity),
          useFactory: mockClientsRepository,
        },
      ],
    }).compile();
    ClientService = await module.get<ClientsService>(ClientsService);
    ClientRepository = module.get<Repository<ClientEntity>>(getRepositoryToken(ClientEntity));
  });

  describe('createClient', () => {
    it('Should create a Client', async () => {
      expect(ClientRepository.save).not.toHaveBeenCalled();

      const createClientDto = {
        companyName: 'Test',
        internalCode: 'IG001',
        taxId: 'T-IG0001-2',
        currency: CurrencyEnum.USD,
        apiQuota: 1500,
        allowedBanks: [1, 2, 4],
      };

      const result = await ClientService.createClient(createClientDto);
      const allowedBanks = JSON.stringify(createClientDto.allowedBanks);

      expect(ClientRepository.save).toHaveBeenCalledWith({ ...createClientDto, allowedBanks });
      expect(result).toEqual({ message: 'Client created successfuly' });
    });
  });

  describe('deleteClient', () => {
    it('Should delete client', async () => {
      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);

      expect(ClientRepository.delete).not.toHaveBeenCalled();

      const result = await ClientService.deleteClient(1);

      expect(ClientRepository.findOne).toHaveBeenCalledWith(1);

      expect(ClientRepository.delete).toHaveBeenCalledWith(1);

      expect(result).toEqual({ message: 'Client deleted successfuly' });
    });

    it('Should throw an error if client does not exist', async () => {
      (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);

      expect(ClientService.deleteClient(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateClient', () => {
    it('Should update a client', async () => {
      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);

      expect(ClientRepository.save).not.toHaveBeenCalled();

      const updateClientDto = {
        taxId: 'T-IG0001-2',
        currency: CurrencyEnum.USD,
      };

      const result = await ClientService.updateClient(1, updateClientDto);

      expect(ClientRepository.findOne).toHaveBeenCalledWith(1);

      expect(ClientRepository.save).toHaveBeenCalledWith({ ...mockClient, ...updateClientDto });

      expect(result).toEqual({ message: 'Client updated successfuly' });
    });

    it('Should throw an error if client does not exist', async () => {
      (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);

      const updateClientDto = {
        taxId: 'T-IG0001-2',
        currency: CurrencyEnum.USD,
      };

      expect(ClientService.updateClient(1, updateClientDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getClients', () => {
    it('Should get all clients', async () => {
      (ClientRepository.find as jest.Mock).mockResolvedValue([mockClient]);
      expect(ClientRepository.find).not.toHaveBeenCalled();
      const result = await ClientService.listClients();
      expect(ClientRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockClient]);
    });
  });
});
