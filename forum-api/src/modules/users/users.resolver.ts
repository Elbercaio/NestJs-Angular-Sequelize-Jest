import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { IUser } from '../../shared/interfaces';
import { FilterOptionsInput } from '../../shared/types';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(@Args('filters') filters: FilterOptionsInput): Promise<IUser[]> {
    return this.usersService.findAll(filters);
  }

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number): Promise<IUser> {
    return this.usersService.findOne(id);
  }
}
