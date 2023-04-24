import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OrderByInput {
  @Field({ nullable: true, defaultValue: 'createdAt' })
  set?: string;

  @Field({ nullable: true, defaultValue: 'DESC' })
  order?: string;
}
