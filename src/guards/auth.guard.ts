import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

interface Options {
  isPublic?: boolean;
  refresh?: boolean;
}

export function AuthGuard(
  isPublic = false,
  refresh = false
): () => Type<IAuthGuard> {
  const strategies = new Array<string>();

  if (isPublic) {
    strategies.push('public');
  }

  if (refresh) {
    strategies.push('jwt-refresh');
  } else {
    strategies.push('jwt-access');
  }

  // @ts-ignore
  return NestAuthGuard(strategies);
}
