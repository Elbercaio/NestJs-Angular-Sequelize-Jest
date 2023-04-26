import { Field, InputType } from '@nestjs/graphql';
import { PageOptionsInput } from '../utils';
import { FilterOptionsInput } from './filter-options.input';
import { OrderByInput } from './order-by.input';

@InputType()
export class FindOptionsInput {
  @Field({ nullable: true })
  filters: FilterOptionsInput;

  @Field({ nullable: true, defaultValue: { page: 1, offset: 20 } })
  paginate: PageOptionsInput;

  @Field({ nullable: true, defaultValue: { set: 'createdAt', order: 'DESC' } })
  orderBy: OrderByInput;
}
