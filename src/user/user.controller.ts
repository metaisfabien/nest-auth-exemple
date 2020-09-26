import {
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UserService } from './user.service';

/**
 * User controller
 */

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * User data
   */
  @ApiOperation({ summary: 'Renvoi les données utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Donnée utilisateur',
    type: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  async user(@Request() req): Promise<UserResponseDto> {
    return new UserResponseDto(req.user);
  }
}
