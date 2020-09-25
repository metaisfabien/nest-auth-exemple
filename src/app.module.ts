import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get('MONGO_URI'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          auth: { authSource: 'admin' },
          user: config.get('MONGO_USER'),
          pass: config.get('MONGO_PASSWORD'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
