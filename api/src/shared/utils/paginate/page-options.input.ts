import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PageOptionsInput {
  @Field({ nullable: true })
  page: number;

  @Field({ nullable: true })
  offset: number;
}
