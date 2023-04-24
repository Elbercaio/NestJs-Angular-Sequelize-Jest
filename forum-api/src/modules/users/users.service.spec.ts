import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { IUser } from '../../shared/interfaces';
import { HandleExceptionService } from '../../shared/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  let testingModule: TestingModule;

  const mockUser: IUser = {
    id: 1,
    cpf: '63738306080',
    email: 'jane@gmail.com',
    name: 'Jane Islands Grantfort',
    updatePassword: () => true,
    comparePassword: () => true,
  };

  const userUpdate: IUser = {
    id: 1,
    cpf: '63738306080',
    email: 'jane_islands@gmail.com',
    name: 'Jane Islands Grantfort',
  };

  const userDto: CreateUserDto = {
    cpf: '63738306080',
    email: 'jane@gmail.com',
    name: 'Jane Islands Grantfort',
    password: 'Qwerty@123',
  };

  const updateUserDto: UpdateUserDto = {
    name: 'Jane Island Grantfort',
  };
  const mockRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
    remove: jest.fn(),
    destroy: jest.fn(),
    scope: jest.fn(() => ({
      findOne: jest.fn(),
    })),
    updatePassword: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn().mockImplementation(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  };

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        HandleExceptionService,
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

  it('findAll()', async () => {
    mockRepository.findAll.mockResolvedValue([mockUser]);
    await expect(service.findAll()).resolves.toEqual([mockUser]);
  });

  it('findAll() with errors', async () => {
    mockRepository.findAll.mockRejectedValue(
      new HttpException(
        {
          message: 'Falha ao buscar usuários.',
        },
        HttpStatus.BAD_GATEWAY
      )
    );
    await expect(service.findAll()).rejects.toThrow('Falha ao buscar usuários.');
  });

  it('findAll() with filters', async () => {
    const filters = {
      cpf: '63738306080',
    };
    mockRepository.findAll.mockResolvedValue([mockUser]);
    await expect(service.findAll(filters)).resolves.toEqual([mockUser]);
  });

  it('findOne()', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser);
    await expect(service.findOne(1)).resolves.toEqual(mockUser);
  });

  it('findOne() mockUser not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow('Usuário não encontrado.');
  });

  it('findOne() with errors', async () => {
    mockRepository.findOne.mockRejectedValue(
      new HttpException(
        {
          message: 'Falha ao buscar usuário.',
        },
        HttpStatus.BAD_REQUEST
      )
    );
    await expect(service.findOne(1)).rejects.toThrowError('Falha ao buscar usuário.');
  });

  it('create()', async () => {
    mockRepository.findOne.mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValue(mockUser);
    mockRepository.create.mockResolvedValue(mockUser);
    await expect(service.create(userDto)).resolves.toEqual(mockUser);
  });

  it('create() email already exists', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser);
    await expect(service.create(userDto)).rejects.toThrow('Esse email já se encontra cadastrado em nosso sistema.');
  });

  it('create() cpf already exists', async () => {
    mockRepository.findOne.mockReturnValueOnce(null).mockReturnValueOnce(mockUser);
    await expect(service.create(userDto)).rejects.toThrow('Esse cpf já se encontra cadastrado em nosso sistema.');
  });

  it('create() with name empty', async () => {
    const newUserDto: CreateUserDto = Object.assign(userDto);
    newUserDto.name = '';
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.create(newUserDto)).rejects.toThrow('Nome precisa ter pelo menos 5 caracteres.');
  });

  it('create() with name have spaces', async () => {
    const newUserDto: CreateUserDto = Object.assign(userDto);
    newUserDto.name = '  Jane Islands Grantfort  ';
    mockRepository.findOne.mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValue(mockUser);
    mockRepository.create.mockResolvedValue(mockUser);
    await expect(service.create(newUserDto)).resolves.toEqual(mockUser);
  });

  it('create() mockUser with errors', async () => {
    const newUserDto: CreateUserDto = Object.assign(userDto);
    newUserDto.name = 'Martin Rodrigues';
    mockRepository.findOne
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockRejectedValue(new HttpException({ message: 'Falha ao criar usuário.' }, HttpStatus.BAD_REQUEST));
    await expect(service.create(newUserDto)).rejects.toThrow('Falha ao criar usuário.');
  });

  it('update()', async () => {
    mockRepository.findOne.mockReturnValueOnce(mockUser).mockReturnValueOnce(null).mockReturnValue(userUpdate);
    await expect(service.update(1, updateUserDto)).resolves.toEqual(userUpdate);
  });

  it('update() email already exists', async () => {
    mockRepository.findOne.mockResolvedValue(userUpdate);
    await expect(service.update(1, updateUserDto)).rejects.toThrow('Esse email já se encontra cadastrado em nosso sistema.');
  });

  it('update() with name empty', async () => {
    const newUserDto: CreateUserDto = Object.assign(updateUserDto);
    newUserDto.name = '';
    mockRepository.findOne.mockResolvedValue(mockUser);
    await expect(service.update(1, newUserDto)).rejects.toThrow('Nome precisa ter pelo menos 5 caracteres.');
  });

  it('update() with name have spaces', async () => {
    const newUserDto: UpdateUserDto = Object.assign(userDto);
    newUserDto.name = '  Update User  ';
    await expect(service.update(1, newUserDto)).resolves.toEqual(userUpdate);
  });

  it('update() mockUser with errors', async () => {
    const newUserDto: UpdateUserDto = Object.assign(updateUserDto);
    newUserDto.name = 'Martin Rodrigues';
    mockRepository.findOne
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(null)
      .mockRejectedValue(new HttpException('Falha ao atualizar usuário.', HttpStatus.BAD_REQUEST));
    await expect(service.update(1, updateUserDto)).rejects.toThrow('Falha ao atualizar usuário.');
  });

  it('remove()', async () => {
    const message = 'Usuário excluído.';
    mockRepository.findOne.mockResolvedValue(mockUser);
    mockRepository.remove.mockResolvedValue(true);
    await expect(service.remove(1)).resolves.toEqual({ message });
  });

  it('remove() mockUser not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.remove(1)).rejects.toThrow('Usuário não encontrado.');
  });

  it('remove() with errors', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser);
    mockRepository.destroy.mockRejectedValue(false);
    await expect(service.remove(1)).rejects.toThrow('Falha ao remover usuário.');
  });
});
