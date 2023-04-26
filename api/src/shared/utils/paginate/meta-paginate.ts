import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field()
  totalItems: number;

  @Field()
  itemCount?: number;

  @Field()
  totalPages?: number;

  @Field()
  page: number;

  @Field({ nullable: true })
  nextPage?: number;

  @Field({ nullable: true })
  prevPage?: number;

  @Field()
  offset: number;
}
