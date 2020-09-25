import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as httpMocks from 'node-mocks-http';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserModel } from './mocked-user-model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

const TEST_EMAIL = 'test@xmail.com';
const TEST_PASSWORD = 'sdfdsfsdfsdfgrth';

describe('AppController', () => {
  let userController: UserController;
  let userService: UserService;
  let testUser: UserResponseDto;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [ConfigModule.forRoot()],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);

    testUser = await userService.create(
      new CreateUserDto({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    );
  });

  // User data
  it('/user', async () => {
    const user = await userService.findByEmail(TEST_EMAIL);
    const req: any = httpMocks.createRequest();

    req.user = user;

    const result = await userController.user(req);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email', TEST_EMAIL);
    expect(result).not.toHaveProperty('password');
  });
});
