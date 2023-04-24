import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((_data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const CurrentUserGraphql = createParamDecorator((_data: any, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const { req } = ctx.getContext();
  const contextHost = new ExecutionContextHost([req], null, ctx.getHandler());
  const request = contextHost.switchToHttp().getRequest();

  return request.user;
});
