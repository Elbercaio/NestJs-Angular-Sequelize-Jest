import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {},
        },
        {
          provide: Sequelize,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call findAll users', () => {
    const findAllSpy = jest.spyOn(service, 'findAll').mockImplementation();
    resolver.findAll({ name: 'Jane' });
    expect(findAllSpy).toBeCalledWith({ name: 'Jane' });
  });

  it('should call findOne user', () => {
    const findOneSpy = jest.spyOn(service, 'findOne').mockImplementation();
    resolver.findOne(1);
    expect(findOneSpy).toBeCalledWith(1);
  });
});
