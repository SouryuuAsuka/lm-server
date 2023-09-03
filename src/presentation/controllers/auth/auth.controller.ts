import { Controller, Get, UseGuards, Post, Body, Delete, Ip, Req } from '@nestjs/common';
import { SigninDto, SignupDto } from '@domain/dtos/user';
import { AuthUseCases } from '@application/use-cases/auth/auth.use-cases';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({
  version: '1',
})
export class AuthController {
  constructor(
    private authUseCases: AuthUseCases,
    ) {}
  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(
    @Body() user: SigninDto,
    @Ip() ip: string,
    @Req() req: any
  ){
    console.log(req.user);
    return this.authUseCases.signin(req.user, ip);
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