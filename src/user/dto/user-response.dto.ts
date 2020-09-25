import { Exclude, Expose } from 'class-transformer';
import { User } from '../schemas/user.schema';

/**
 * Object user pour les réponse
 */
export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;

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
