import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserModel } from '../../user/test/mocked-user-model';

const TEST_EMAIL = 'test@xmail.com';
const TEST_PASSWORD = 'sdfdsfsdfsdfgrth';

describe('AppController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
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
        UserService,
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
        AuthService,
        LocalStrategy,
        JwtStrategy,
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    authController = app.get<AuthController>(AuthController);
    userService = app.get<UserService>(UserService);
  });

  // Inscription
  it('register', async () => {
    const user = await authController.register({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email', TEST_EMAIL);
    expect(user).not.toHaveProperty('password');
  });

  // Authentification
  it('login', async () => {
    const user = await userService.findByEmail(TEST_EMAIL, true);
    const result = await authController.login({ user });

    expect(result).toHaveProperty('accessToken');
  });
});
