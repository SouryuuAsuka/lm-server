import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Delete,
  Ip,
  Req,
  Res,
} from '@nestjs/common';
import { SignupDto } from '@src/domain/dtos/user';
import { AuthUseCases } from '@src/application/use-cases/auth.use-case';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import {
  JwtAuthGuard,
  SimpleUserGuard,
  RefreshTokenGuard,
} from '@src/framework/nestjs/guards/auth.guard';

@ApiTags('auth')
@Controller({
  version: '1',
})
export class AuthController {
  constructor(private authUseCases: AuthUseCases) { }
  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(
    @Ip() ip: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profileLink: profileLink,
    } = await this.authUseCases.signin(req.user, ip);
    res.cookie('accessToken', accessToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    res.cookie('refreshToken', refreshToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    return res.send({
      status: 'success',
      data: {
        profile: profileLink,
      },
    });
  }

  @UseGuards(SimpleUserGuard)
  @Post('signup')
  async signup(@Body() user: SignupDto) {
    return this.authUseCases.signup(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('token')
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: FastifyReply,
    @Ip() ip: string,
  ) {
    const { accessToken: accessToken, refreshToken: refreshToken } =
      await this.authUseCases.refreshToken(req.user, ip);
    res.cookie('accessToken', accessToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    res.cookie('refreshToken', refreshToken, {
      domain: process.env.SERVER_DOMAIN,
    });
    return res.send({
      status: 'success',
      data: {},
    });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('token')
  async signout() {
    return this.authUseCases.signout();
  }
}
