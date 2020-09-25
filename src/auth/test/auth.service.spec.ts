import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';

import { UserModel } from '../../user/test/mocked-user-model';

const TEST_EMAIL = 'test@xmail.com';
const TEST_PASSWORD = 'eT5cH0nT';

/**
 * Test du authService d'authentification
 */
describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  /**
   * Initialisation de l'environement de test
   */
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // JWT Module
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secretOrPrivateKey: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: 3600,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        UserService,
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  /**
   * Test la method validUser
   */
  it('validateUser', async () => {
    const user = new UserModel({
      email: TEST_EMAIL,
      password: userService.hashPassword(TEST_PASSWORD),
    });
    await user.save();

    let result = await authService.validateUser(user.email, TEST_PASSWORD);
    expect(result).not.toBeNull();
    expect(result).toMatchObject({ email: user.email });

    result = await authService.validateUser(user.email + 'a', TEST_PASSWORD);
    expect(result).toBeNull();

    result = await authService.validateUser(user.email, TEST_PASSWORD + 'a');
    expect(result).toBeNull();
  });

  /**
   * Test la method login
   */
  it('login', async () => {
    const user = await userService.findByEmail(TEST_EMAIL, true);
    let result = await authService.login(user);
    expect(result).toHaveProperty('accessToken');
  });
});
