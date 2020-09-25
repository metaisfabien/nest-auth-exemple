import { Module } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { TestService } from './test.service';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, AuthModule],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
