import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcryptjs from 'bcryptjs';
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
      const user = await this.userModel.findAll({
        order: [['name', 'ASC']],
        where,
      });
      return user;
    } catch (error) {
      const { message, status } = error;
      const statusCode = status || HttpStatus.BAD_REQUEST;
      const msgError = message || 'Falha ao buscar usuários.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async findOne(id: number): Promise<IUser> {
    try {
      const user = await this.userModel.findByPk(id);

      if (!user) {
        throw new HttpException({ message: 'Usuário não encontrado.' }, HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      const { message, status } = error;
      const statusCode = status || HttpStatus.BAD_REQUEST;
      const msgError = message || 'Falha ao buscar usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const transaction = await this.sequelize.transaction();
    try {
      const { email, cpf } = createUserDto;

      const emailAlreadyExists = await this.userModel.findOne({
        where: {
          email,
        },
      });

      if (emailAlreadyExists) {
        throw new HttpException({ message: 'Esse email já se encontra cadastrado em nosso sistema.' }, HttpStatus.BAD_REQUEST);
      }

      const cpfAlreadyExists = await this.userModel.findOne({
        where: {
          cpf,
        },
      });

      if (cpfAlreadyExists) {
        throw new HttpException({ message: 'Esse cpf já se encontra cadastrado em nosso sistema.' }, HttpStatus.BAD_REQUEST);
      }

      const user: IUser = await this.userModel.create(createUserDto as User, { transaction });

      user.password = '';
      await transaction.commit();

      return user;
    } catch (error) {
      await transaction.rollback();
      const { message, status } = error;
      const statusCode = status || HttpStatus.BAD_REQUEST;
      const msgError = message || 'Falha ao criar usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<IDataMessage<IUser>> {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException({ message: 'Usuário não encontrado.' }, HttpStatus.NOT_FOUND);
      }

      const { email = null } = updateUserDto;

      const emailAlreadyExists: User = await this.userModel.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });

      if (emailAlreadyExists) {
        throw new HttpException({ message: 'Esse email já se encontra cadastrado em nosso sistema.' }, HttpStatus.BAD_REQUEST);
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcryptjs.hash(updateUserDto.password, 10);
      }
      const updatedUser = await user.update(updateUser, {
        transaction,
        where: {
          id,
        },
      });
      await transaction.commit();

      return { data: updatedUser, message: 'Usuário atualizado com sucesso.' };
    } catch (error) {
      await transaction.rollback();
      const { message, status } = error;
      const statusCode = status || HttpStatus.BAD_REQUEST;
      const msgError = message || 'Falha ao atualizar usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async remove(id: number): Promise<IMessage> {
    try {
      const user = await this.userModel.findOne({
        where: {
          id,
        },
      });

      if (!user) {
        throw new HttpException({ message: 'Usuário não encontrado.' }, HttpStatus.NOT_FOUND);
      }

      await this.userModel.destroy({
        where: {
          id,
        },
      });
      return { message: 'Usuário excluído.' };
    } catch (error) {
      const { message, status } = error;
      const statusCode = status || HttpStatus.BAD_REQUEST;
      const msgError = message || 'Falha ao remover usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }
}
