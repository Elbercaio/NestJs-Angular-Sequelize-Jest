import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config/database';
import { graphql } from './config/graphql';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [database, graphql, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
