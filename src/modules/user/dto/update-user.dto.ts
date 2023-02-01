export class UpdateUserDto {
  public readonly firstName?: string;

  public readonly lastName?: string;

  public readonly password?: string;

  public readonly phone?: string;

  public readonly avatar?: string;

  public readonly isPhoneVerified?: boolean;

  public readonly isEmailVerified?: boolean;
}
