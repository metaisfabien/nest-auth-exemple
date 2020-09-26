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
 * Test des routes du controller AuthController
 */
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;

  /**
   * Création de l'environnment de test
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(new ValidationPipe());

    testService = app.get<TestService>(TestService);
    await app.init();
  });

  /**
   * Nétoyage et arret
   */
  afterAll(async () => {
    await testService.stop();
    await app.close();
  });

  /**
   * Test l'inscription
   */
  it('auth/register', async () => {
    let res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'aaaa', password: TEST_PASSWORD });

    expect(res.body).toHaveProperty('statusCode', 400);

    res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: 'aaaa' });

    expect(res.body).toHaveProperty('statusCode', 400);

    res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.body).toHaveProperty('email', TEST_EMAIL);
    expect(res.body).toHaveProperty('id');
    expect(res.body).not.toHaveProperty('password');
  });

  /**
   * Test l'authentification
   */
  it('/auth/login', async () => {
    // Invalide login
    let res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_EMAIL + 'a', password: TEST_PASSWORD });

    expect(res.body).toHaveProperty('statusCode', 401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');

    // Invalide login
    res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD + 'a' });

    expect(res.body).toHaveProperty('statusCode', 401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');

    // Valide login
    res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.body).toHaveProperty('accessToken');
  });
});
