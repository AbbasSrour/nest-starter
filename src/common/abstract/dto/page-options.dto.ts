import { Order } from '@constants';
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '@decorators';

export class PageOptionsDto {
  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  public readonly order: Order = Order.ASC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  public readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
    int: true,
  })
  public readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @StringFieldOptional()
  public readonly q?: string;
}
