import { Controller, Get, UseGuards, Post, Body, Delete, Ip, Req, Res } from '@nestjs/common';
import { SignupDto } from '@domain/dtos/user';
import { AuthUseCases } from '@application/use-cases/auth/auth.use-cases';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtAuthGuard, SimpleUserGuard, RefreshTokenGuard } from '@framework/nestjs/guards/auth.guards';


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
    @Ip() ip: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { accessToken: accessToken, refreshToken: refreshToken, profileLink: profileLink } = await this.authUseCases.signin(req.user, ip);
    res.cookie('accessToken', accessToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    res.cookie('refreshToken', refreshToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    return res.send({
      status: "success",
      data: {
        profile: profileLink
      }
    });
  }

  @Post('signup')
  async signup(
    @Body() user: SignupDto
  ) {
    return this.authUseCases.signup(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('token')
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: FastifyReply,
    @Ip() ip: string
  ) {
    const { accessToken: accessToken, refreshToken: refreshToken } = await this.authUseCases.refreshToken(req.user, ip);
    res.cookie('accessToken', accessToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    res.cookie('refreshToken', refreshToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    return res.send({
      status: "success",
      data: {}
    });
  }


  @UseGuards(AuthGuard('jwt'))
  @Delete('token')
  async signout() {
    return this.authUseCases.signout();
  }
}