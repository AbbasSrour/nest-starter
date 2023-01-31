import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResetPasswordBo {
  @Expose()
  token: string;

  @Expose()
  password: string;
}
