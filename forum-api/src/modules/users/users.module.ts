import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([])],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [SequelizeModule, UsersService],
})
export class UsersModule {}
