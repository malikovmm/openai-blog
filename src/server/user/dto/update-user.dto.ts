export class UpdateUserDto {
  id?: number;

  username?: string;
  passwordHash?: string;
  refreshToken?: string;
}
