import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../utils/paginate/meta-paginate';
import { ClassConstructor } from 'class-transformer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function PaginatedResponse<TModel>(model: ClassConstructor<TModel>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field({ nullable: true })
    pageInfo: PageInfo;

    @Field(() => [model], { nullable: true })
    items: TModel[];
  }
  return PaginatedResponseClass;
}
