import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
@ValidatorConstraint({ name: 'uniqueUserEmail', async: true })
export class UniqueUserEmail implements ValidatorConstraintInterface {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
  ) {}

  /**
   * Vérrifie si un email exist
   */
  async validate(email: string, args: ValidationArguments) {
    const user = await this.userService.findByEmail(email);
    return user === null;
  }

  defaultMessage(args: ValidationArguments) {
    return '($value) is already registred!';
  }
}
