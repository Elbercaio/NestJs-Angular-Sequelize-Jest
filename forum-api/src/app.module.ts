import { graphql } from './config/graphql';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config/database';
import { UserModule } from './user/user.module';

@Module({
  imports: [database, graphql, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
