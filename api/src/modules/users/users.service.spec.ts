import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { ITestModel, IUser } from '../../shared/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

interface ITestUser extends ITestModel, IUser {
  comparePassword: jest.Mock;
}
describe('UsersService', (): void => {
  let service: UsersService;

  let testingModule: TestingModule;

  const mockCreateUserDto: CreateUserDto = {
    cpf: '63738306080',
    email: 'jane@gmail.com',
    name: 'Jane Islands Grantfort',
    password: 'Qwerty@123',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'Jane Island Grantfort',
    password: 'Qwerty@12345',
    oldPassword: 'Qwerty@123',
  };

  const mockUser: ITestUser = {
    id: 1,
    cpf: '63738306080',
    email: 'jane@gmail.com',
    name: 'Jane Islands Grantfort',
    comparePassword: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockUpdatedUser: IUser = {
    id: 1,
    cpf: '63738306080',
    email: 'jane_islands@gmail.com',
    name: 'Jane Island Grantfort',
  };

  const mockRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn().mockImplementation(() => ({
      commit: jest.fn().mockImplementation(() => true),
      rollback: jest.fn().mockImplementation(() => true),
    })),
  };

  beforeEach(async (): Promise<void> => {
    testingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockRepository,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = testingModule.get<UsersService>(UsersService);
  });

  afterEach((): void => {
    jest.resetAllMocks();
  });

  describe('create user', (): void => {
    it('should create a user', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockUser);
      const result = await service.create(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw already exists', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValueOnce(mockUser);
      await service.create(mockCreateUserDto).catch((error): void => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('This email is already registered in our system.');
        expect(error.status).toEqual(HttpStatus.CONFLICT);
      });
    });

    it('should throw already exists', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.findOne.mockResolvedValueOnce(mockUser);
      await service.create(mockCreateUserDto).catch((error): void => {
        console.log('\n \n file: users.service.spec.ts:108 \n it \n error:', error);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('This cpf is already registered in our system.');
        expect(error.status).toEqual(HttpStatus.CONFLICT);
      });
    });

    it('should throw error', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockRejectedValueOnce(new Error());
      await service.create(mockCreateUserDto).catch((error): void => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Failed to create user.');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('findAll users', (): void => {
    it('should findAll users', async (): Promise<void> => {
      mockRepository.findAll.mockResolvedValueOnce([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });

    it('should throw error', async (): Promise<void> => {
      mockRepository.findAll.mockRejectedValueOnce(new Error());
      await service.findAll().catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Failed to fetch users.');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('findOne User', (): void => {
    it('should findOne user', async (): Promise<void> => {
      mockRepository.findByPk.mockResolvedValueOnce(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });
  });

  it('should throw user not exists', async (): Promise<void> => {
    mockRepository.findByPk.mockResolvedValueOnce(null);
    await service.findOne(2).catch((error) => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('User not found.');
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  it('should throw error', async (): Promise<void> => {
    mockRepository.findByPk.mockRejectedValueOnce(new Error());
    await service.findOne(1).catch((error) => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Failed to fetch user.');
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe('update User', (): void => {
    it('should update user', async (): Promise<void> => {
      mockRepository.findByPk.mockResolvedValueOnce(mockUser);
      mockUser.comparePassword.mockResolvedValueOnce(Promise.resolve(true));
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => '$2b$10$Ouq0nnxtmTfB9KgbQxr8Ge0PKBcFrdFoSa3YMOB/Mz22ogkvEgh7u');
      mockUser.update.mockResolvedValueOnce(mockUpdatedUser);
      const result = await service.update(1, mockUpdateUserDto);
      expect(result).toEqual({ data: mockUpdatedUser, message: 'User updated successfully.' });
    });

    it('should throw user not exist', async (): Promise<void> => {
      mockUser.update.mockResolvedValueOnce(mockUpdatedUser);
      await service.update(2, mockUpdateUserDto).catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User not found.');
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      });
    });

    it('should throw error incorrect password', async (): Promise<void> => {
      mockRepository.findByPk.mockResolvedValueOnce(mockUser);
      mockUser.comparePassword.mockResolvedValue(Promise.resolve(false));
      await service.update(1, mockUpdateUserDto).catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Incorrect password.');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      });
    });

    it('should throw error', async (): Promise<void> => {
      mockRepository.findByPk.mockResolvedValueOnce(mockUser);
      mockUser.update.mockRejectedValueOnce(new Error());
      await service.update(1, mockUpdateUserDto).catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Failed to update user.');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('remove User', () => {
    it('should remove user', async (): Promise<void> => {
      const message = 'User deleted successfully.';
      mockRepository.findByPk.mockResolvedValueOnce(mockUser);
      mockUser.destroy.mockResolvedValueOnce(true);
      const result = await service.remove(1);
      expect(result).toEqual({ message });
    });

    it('should throw user not exist', async (): Promise<void> => {
      mockUser.destroy.mockResolvedValueOnce(null);
      await service.remove(2).catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User not found.');
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      });
    });

    it('should throw error', async (): Promise<void> => {
      mockRepository.findByPk.mockResolvedValueOnce(mockUser);
      mockUser.destroy.mockRejectedValueOnce(new Error());
      await service.remove(1).catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Failed to delete user.');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
