import type { AbstractEntity } from '@common/abstract/abstract.entity';
import type { AbstractDto } from '@common/abstract/dto/abstract.dto';
import type { Constructor } from '../types';

export function UseDto(
  dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
