import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@ValidatorConstraint({ name: 'unique-user-email', async: true })
@Injectable()
export class UniqueUserEmail implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

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
