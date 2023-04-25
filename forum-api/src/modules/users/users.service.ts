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
      const user: User[] = await this.userModel.findAll({
        order: [['name', 'ASC']],
        where,
      });
      return user;
    } catch (error) {
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Falha ao buscar usuários.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async findOne(id: number): Promise<IUser> {
    try {
      const user: User | null = await this.userModel.findByPk(id);

      if (!user) {
        throw new HttpException({ message: 'Usuário não encontrado.' }, HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Falha ao buscar usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const transaction = await this.sequelize.transaction();
    try {
      const { email, cpf } = createUserDto;

      const emailAlreadyExists: User | null = await this.userModel.findOne({
        where: {
          email,
        },
      });

      if (emailAlreadyExists) {
        throw new HttpException({ message: 'Esse email já se encontra cadastrado em nosso sistema.' }, HttpStatus.BAD_REQUEST);
      }

      const cpfAlreadyExists: User | null = await this.userModel.findOne({
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
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Falha ao criar usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<IDataMessage<IUser>> {
    const transaction = await this.sequelize.transaction();
    try {
      const user = (await this.findOne(id)) as User;

      if (!user) {
        throw new HttpException({ message: 'Usuário não encontrado.' }, HttpStatus.NOT_FOUND);
      }

      if (updateDto?.email && user?.email !== updateDto?.email) {
        const emailAlreadyExists: User | null = await this.userModel.findOne({
          where: {
            email: updateDto.email,
            id: { [Op.ne]: id },
          },
        });

        if (emailAlreadyExists) {
          throw new HttpException({ message: 'Esse email já se encontra cadastrado em nosso sistema.' }, HttpStatus.BAD_REQUEST);
        }
      }

      if (updateDto.password) {
        updateDto.password = await bcryptjs.hash(updateDto.password, 10);
      }

      const updatedUser: User = await user.update(Object.assign(user, updateDto), {
        transaction,
      });
      await transaction.commit();

      return { data: updatedUser, message: 'Usuário atualizado com sucesso.' };
    } catch (error) {
      await transaction.rollback();
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Falha ao atualizar usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }

  async remove(id: number): Promise<IMessage> {
    try {
      const user: User | null = await this.userModel.findOne({
        where: {
          id,
        },
      });

      if (!user) {
        throw new HttpException({ message: 'Usuário não encontrado.' }, HttpStatus.NOT_FOUND);
      }

      await user.destroy();
      return { message: 'Usuário excluído.' };
    } catch (error) {
      const { message, status } = error;
      const statusCode: HttpStatus = status || HttpStatus.BAD_REQUEST;
      const msgError: string = message || 'Falha ao remover usuário.';
      throw new HttpException({ message: msgError }, statusCode);
    }
  }
}
