import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';

/**
 * Service utilisateurs
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  /**
   * Crée un nouvelle utilisateur
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    createUserDto.password = this.hashPassword(createUserDto.password);
    const user = new this.userModel(createUserDto);
    await user.save();
    return new UserResponseDto(user);
  }

  /**
   * Récupère un utilisateur par son email
   */
  async findByEmail(
    email: string,
    password: boolean = false,
  ): Promise<User | undefined> {
    const select: any = {};
    if (!password) {
      select.password = 0;
    }
    return this.userModel.findOne({ email }, select);
  }

  /**
   * Récupère un utilisateur par son id
   */
  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findOne({ _id: id }).select({ password: 0, __v: 0 });
  }

  /**
   * Hash un mot de passe en sha512.
   *
   * @param {string} password Mot de passe en claire
   *
   * @return {String}
   * @see https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
   */
  hashPassword(password: string): string {
    const hash = crypto.createHmac(
      'sha512',
      this.configService.get('PASSWORD_SALT'),
    );
    hash.update(password);
    return hash.digest('hex');
  }
}
