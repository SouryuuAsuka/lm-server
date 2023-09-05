import { Controller, Get, Param, UseGuards, Post, Body, Put, Query, Delete, Req } from '@nestjs/common';
import { UsersUseCases } from '@application/use-cases/user/user.use-cases';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, SimpleUserGuard } from '@framework/nestjs/guards/auth.guards';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersUseCases: UsersUseCases) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(
    @Req() req: any,
  ) {
    const user = await this.usersUseCases.getUser(req.user.userId);
    return {
      status: "success",
      data: {
        user: user
      }
    }
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string
  ) {
    const user = await this.usersUseCases.getUserByUsername(username);
    return {
      status: "success",
      data: {
        user: user
      }
    }
  }

  @Get(':username/orgs')
  async getOrgListByUsername(
    @Param('username') username: string,
    @Body('page') page: number,
    @Body('city') city: string,
    @Body('category') category: string,
  ) {
    const orgs = await this.usersUseCases.getOrgListByUsername(username, page, city, category);
    return {
      status: "success",
      data: {
        orgs: orgs
      }
    }
  }

  /*@Post('signin')
  async signin(
    @Body() signinDto: SigninDto
  ){
    return this.usersUseCases.signin(signinDto);
  }

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto
  ){
    return this.usersUseCases.signup(signupDto);
  }

  @Get('token')
  async refreshToken() {
    return this.usersUseCases.refreshToken();
  }

  @Delete('token')
  async signout() {
    return this.usersUseCases.signout();
  }*/
}