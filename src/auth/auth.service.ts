import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { LoginResponseDto } from './dto/login-response.dto';

/**
 * Service d'authentification JWT
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Vérrifie le mot de passe d'un utilisateur
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email, true);

    const hashedPassword = this.userService.hashPassword(password);

    if (user && user.password === hashedPassword) {
      delete user.password;
      return user;
    }
    return null;
  }

  /**
   * Authentifie un utilisateur
   */
  async login(user: User): Promise<LoginResponseDto> {
    const payload = { email: user.email, sub: user._id.toString() };
    return new LoginResponseDto({
      accessToken: this.jwtService.sign(payload),
    });
  }
}
