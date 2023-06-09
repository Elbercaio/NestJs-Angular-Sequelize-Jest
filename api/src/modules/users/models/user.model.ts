import { Field, Int, ObjectType } from '@nestjs/graphql';

import * as bcrypt from 'bcrypt';
import { BeforeCreate, Column, DefaultScope, Model, Table } from 'sequelize-typescript';
import { IUser } from '../../../shared/interfaces';

@ObjectType()
@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
@Table({
  modelName: 'users',
  underscored: true,
  paranoid: true,
})
export class User extends Model<User> implements IUser {
  @Field(() => Int)
  id?: number;

  @Field()
  @Column
  name: string;

  @Field()
  @Column
  email: string;

  @Field()
  @Column
  cpf: string;

  @Column
  password: string;

  @BeforeCreate
  static async beforeCreateHook(user: User): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
  }

  comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
}
