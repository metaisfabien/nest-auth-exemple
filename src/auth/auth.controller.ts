import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';

/**
 * Auth controller
 */
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /**
   * Inscription
   */
  @ApiOperation({ summary: 'Crée un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Donnée utilisateur',
    type: UserResponseDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('auth/register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  /**
   * Authentification
   */
  @ApiOperation({ summary: 'Authentifie un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Donnée utilisateur',
    type: LoginResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request() req,
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }
}
