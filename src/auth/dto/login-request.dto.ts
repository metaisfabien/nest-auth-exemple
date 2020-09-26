import { ApiProperty } from '@nestjs/swagger';

/**
 * Object request pour le login
 */
export class LoginRequestDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: 'secretPassw0rd',
    description: 'Password',
  })
  password: string;
  /**
   * Assignement des properties
   */
  constructor(payload: Partial<any> = null) {
    if (payload) {
      Object.assign(this, payload);
    }
  }
}
