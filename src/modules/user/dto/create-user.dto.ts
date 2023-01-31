export class CreateUserDto {
  public readonly firstName: string;

  public readonly lastName: string;

  public readonly email: string;

  public readonly password: string;

  public readonly phone?: string;
}
