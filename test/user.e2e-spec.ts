import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

const TEST_EMAIL = 'test@xmail.com';
const TEST_PASSWORD = 'sdfdsfsdfsdfgrth';

/**
 * Test des routes du controller UserController
 */
describe('UserController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let accessToken: string;

  /**
   * Création de l'environnment de test
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe());

    testService = app.get<TestService>(TestService);

    await app.init();
    await testService.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    const result = await testService.getUserAccessToken(TEST_EMAIL);
    accessToken = result.accessToken;
  });

  /**
   * Nétoyage et arret
   */
  afterAll(async () => {
    await testService.stop();
    await app.close();
  });

  /**
   * Test /user
   */
  it('/user', async () => {
    // Invalide login
    let res = await request(app.getHttpServer()).get('/user');

    expect(res.body).toHaveProperty('statusCode', 401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');

    // Invalide login
    res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', TEST_EMAIL);
    expect(res.body).not.toHaveProperty('password');
  });
});
