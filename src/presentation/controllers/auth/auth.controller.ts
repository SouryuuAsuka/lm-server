import { Controller, Get, UseGuards, Post, Body, Delete, Ip, Req, Res } from '@nestjs/common';
import { SigninDto, SignupDto } from '@domain/dtos/user';
import { AuthUseCases } from '@application/use-cases/auth/auth.use-cases';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';

@ApiTags('auth')
@Controller({
  version: '1',
})
export class AuthController {
  constructor(
    private authUseCases: AuthUseCases,
  ) { }
  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(
    @Body() user: SigninDto,
    @Ip() ip: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    console.log("process.env.SERVER_HOST "+ process.env.SERVER_HOST)
    const { accessToken: accessToken, refreshToken: refreshToken, profileLink: profileLink } = await this.authUseCases.signin(req.user, ip);
    res.cookie('accessToken', accessToken, {
      domain: process.env.SERVER_HOST,
    });
    res.cookie('refreshToken', refreshToken, {
      domain: process.env.SERVER_HOST,
    });
    return res.send({ profile: profileLink });
  }

  @Post('signup')
  async signup(
    @Body() user: SignupDto
  ) {
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