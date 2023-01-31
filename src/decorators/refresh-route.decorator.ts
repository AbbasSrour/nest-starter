import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

const REFRESH_ROUTE_KEY = 'refresh_route';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RefreshRoute = (isRefresh = false): CustomDecorator =>
  SetMetadata(REFRESH_ROUTE_KEY, isRefresh);
