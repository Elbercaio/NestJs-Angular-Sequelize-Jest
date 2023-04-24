import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterOptionsInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  userId?: number;

  @Field({ nullable: true })
  cpf?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;
}
