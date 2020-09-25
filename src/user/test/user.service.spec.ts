import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';

import { UserService } from '../user.service';
import { UserModel } from './mocked-user-model';
import { CreateUserDto } from '../dto/create-user.dto';

const TEST_EMAIL = 'test@xmail.com';
const TEST_PASSWORD = 'sdfdsfsdfsdfgrth';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
        UserService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  /**
   * Test create method
   */
  it('create', async () => {
    const createUserDto = new CreateUserDto({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    const userResponseDto = await userService.create(createUserDto);

    expect(userResponseDto).toHaveProperty('id');
    expect(userResponseDto).toHaveProperty('email', TEST_EMAIL);
    expect(userResponseDto).not.toHaveProperty('password');
  });

  /**
   * Test findByEmail method
   */
  it('findByEmail', async () => {
    let result = await userService.findByEmail(TEST_EMAIL);

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('email', TEST_EMAIL);
    expect(result).not.toHaveProperty('password');

    result = await userService.findByEmail(TEST_EMAIL, true);
    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('email', TEST_EMAIL);
    expect(result).toHaveProperty('password');
    expect(result.password).not.toBe(TEST_PASSWORD);

    result = await userService.findByEmail(TEST_EMAIL + 'x');
    expect(result).toBeNull();
  });
});
