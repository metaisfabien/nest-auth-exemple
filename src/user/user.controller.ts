import {
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UserService } from './user.service';
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * User data
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  async user(@Request() req): Promise<UserResponseDto> {
    return new UserResponseDto(req.user);
  }
}
