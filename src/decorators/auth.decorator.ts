import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import type { RoleType } from '@constants';
import { RefreshRoute } from '@decorators/refresh-route.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { AuthUserInterceptor } from '@interceptors/auth-user-interceptor.service';

import { PublicRoute } from './public-route.decorator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean; refresh: boolean }>
): MethodDecorator {
  const isPublicRoute = options?.public;
  const isRefreshRoute = options?.refresh;

  return applyDecorators(
    SetMetadata('roles', roles),
    PublicRoute(isPublicRoute),
    RefreshRoute(isRefreshRoute),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(AuthGuard(isPublicRoute, isRefreshRoute), RolesGuard),
    UseGuards(AuthGuard)
  );
}
