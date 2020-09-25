import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { UserService } from '../src/user/user.service';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { AuthService } from '../src/auth/auth.service';

/**
 * Service pour les tests e2e
 */
@Injectable()
export class TestService {
  constructor(
    @InjectConnection() private connection: Connection,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  /**
   * Crée un utilisateur
   */
  createUser(userData: any) {
    return this.userService.create(new CreateUserDto(userData));
  }

  /**
   * Renvoi le token d'access d'un user
   */
  async getUserAccessToken(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    return this.authService.login(user);
  }

  /**
   * Suprime les data crée
   */
  async stop() {
    const models = this.connection.models;
    for (const model of Object.keys(models)) {
      await models[model].deleteMany({});
    }
  }
}
