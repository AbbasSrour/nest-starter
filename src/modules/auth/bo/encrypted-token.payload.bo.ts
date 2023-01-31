import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EncryptedTokenPayloadBo {
  @Expose()
  public readonly expiresIn: number;

  @Expose()
  public readonly token: string;

  constructor(data: { expiresIn: number; token: string }) {
    this.expiresIn = data.expiresIn;
    this.token = data.token;
  }
}
