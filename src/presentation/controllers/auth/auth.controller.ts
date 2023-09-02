import { Controller, Get, UseGuards, Post, Body, Delete, Ip } from '@nestjs/common';
import { SigninDto, SignupDto } from '@domain/dtos/user';
import { AuthUseCases } from '@application/use-cases/auth/auth.use-cases';
import { UsersUseCases } from '@application/use-cases/user/user.use-cases';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(
    private authUseCases: AuthUseCases,
    private usersUseCases: UsersUseCases
    ) {}
  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(
    @Body() user: SigninDto,
    @Ip() ip: string
  ){
    return this.authUseCases.signin(user, ip);
  }

  @Post('signup')
  async signup(
    @Body() user: SignupDto
  ){
    return this.authUseCases.signup(user);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('token')
  async refreshToken() {
    return this.authUseCases.refreshToken();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('token')
  async signout() {
    return this.authUseCases.signout();
  }
}