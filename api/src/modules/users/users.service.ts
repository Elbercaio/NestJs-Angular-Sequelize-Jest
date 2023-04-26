import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { IDataMessage, IMessage, IUser } from '../../shared/interfaces';
import { FilterOptionsInput } from '../../shared/types';
import { FilterObject, createFilters } from '../../shared/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize
  ) {}

  async findAll(filters: FilterOptionsInput = {}): Promise<IUser[]> {
    try {
      const where: FilterObject = createFilters(filters);
      return await this.userModel.findAll({
        order: [['name', 'ASC']],
        where,
      });
    } catch (error) {
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Failed to fetch users.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async findOne(id: number): Promise<IUser> {
    try {
      const user: User | null = await this.userModel.findByPk(id);

      if (!user) {
        throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Failed to fetch user.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async create(createDto: CreateUserDto): Promise<IUser> {
    const transaction = await this.sequelize.transaction();
    try {
      const { email, cpf } = createDto;

      const emailAlreadyExists: User | null = await this.userModel.findOne({
        where: {
          email,
        },
      });

      if (emailAlreadyExists) {
        throw new HttpException({ message: 'This email is already registered in our system.' }, HttpStatus.BAD_REQUEST);
      }

      const cpfAlreadyExists: User | null = await this.userModel.findOne({
        where: {
          cpf,
        },
      });

      if (cpfAlreadyExists) {
        throw new HttpException({ message: 'This cpf is already registered in our system.' }, HttpStatus.BAD_REQUEST);
      }

      const user: IUser = await this.userModel.create(createDto as User, { transaction });

      await transaction.commit();

      return user;
    } catch (error) {
      await transaction.rollback();
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Failed to create user.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<IDataMessage<IUser>> {
    const transaction = await this.sequelize.transaction();
    try {
      const user: User | null = await this.userModel.findByPk(id);

      if (!user) {
        throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);
      }

      if (updateDto?.email && user?.email !== updateDto?.email) {
        const emailAlreadyExists: User | null = await this.userModel.findOne({
          where: {
            email: updateDto.email,
            id: { [Op.ne]: id },
          },
        });

        if (emailAlreadyExists) {
          throw new HttpException({ message: 'This email is already registered in our system.' }, HttpStatus.BAD_REQUEST);
        }
      }

      if (updateDto?.password && updateDto?.oldPassword) {
        const correctPassword: boolean = await user.comparePassword(updateDto.oldPassword);
        if (!correctPassword) {
          throw new HttpException({ message: 'Incorrect password.' }, HttpStatus.BAD_REQUEST);
        }
        updateDto.password = await bcrypt.hash(updateDto.password, 10);
        delete updateDto?.oldPassword;
      }

      const updatedUser: User = await user.update(Object.assign(user, updateDto), {
        transaction,
      });
      await transaction.commit();

      return { data: updatedUser, message: 'User updated successfully.' };
    } catch (error) {
      await transaction.rollback();
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Failed to update user.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async remove(id: number): Promise<IMessage> {
    const transaction = await this.sequelize.transaction();
    try {
      const user: User | null = await this.userModel.findByPk(id);
      if (!user) {
        throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);
      }

      await user.destroy({ transaction });
      await transaction.commit();
      return { message: 'User deleted successfully.' };
    } catch (error) {
      await transaction.rollback();
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Failed to delete user.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }
}
