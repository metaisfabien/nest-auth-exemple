import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UniqueUserEmail } from './validators/unique-user-email.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [ConfigService, UserService, UniqueUserEmail],
  exports: [UserService],
})
export class UserModule {}
