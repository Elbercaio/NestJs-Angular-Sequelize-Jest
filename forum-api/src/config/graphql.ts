import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '../../user/user.module';

export const graphql = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: 'schema.gql',
  playground: process.env.APP_MODE === 'dev',
  buildSchemaOptions: {
    dateScalarMode: 'isoDate',
  },
  include: [UserModule],
});
