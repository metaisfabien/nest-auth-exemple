import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../schemas/user.schema';

/**
 * Object user pour les réponse
 */
export class UserResponseDto {
  @ApiProperty({
    example: '5f65d3401bc86d32b3306d48',
    description: 'Identifiant',
  })
  id: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email',
  })
  email: string;

  @Exclude()
  _id: string;
  @Exclude()
  password: string;
  @Exclude()
  __v: number;

  /**
   * Assignement des properties et notoyage
   */
  constructor(user: Partial<User> = null) {
    if (user) {
      Object.assign(this, { ...user.toJSON(), id: user._id.toString() });
      delete this._id;
      delete this.password;
      delete this.__v;
    }
  }
}
