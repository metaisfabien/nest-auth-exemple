import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { UniqueUserEmail } from '../../auth/validators/unique-user-email.validator';

export class CreateUserDto {
  @IsEmail()
  @Validate(UniqueUserEmail)
  email: string;

  @Length(16, 256)
  @IsNotEmpty()
  password: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
