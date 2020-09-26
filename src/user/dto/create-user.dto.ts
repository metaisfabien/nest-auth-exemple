import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueUserEmail } from '../validators/unique-user-email.validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email',
  })
  @IsEmail()
  @Validate(UniqueUserEmail)
  email: string;

  @ApiProperty({
    example: 'secretPassw0rd',
    description: 'Password',
  })
  @Length(8, 256)
  @IsNotEmpty()
  password: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
