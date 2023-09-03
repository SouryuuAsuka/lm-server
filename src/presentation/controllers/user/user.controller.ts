import { Controller, Get, Param, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { UsersUseCases } from '@application/use-cases/user/user.use-cases';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersUseCases: UsersUseCases) {}

  @Get()
  async getUser() {
    const userId=0;
    return this.usersUseCases.getUser(userId);
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string
  ) {
    return this.usersUseCases.getUserByUsername(username);
  }

  @Get(':username/orgs')
  async getOrgListByUsername(
    @Param('username') username: string,
    @Body('page') page: number,
    @Body('city') city: string,
    @Body('category') category: string,
  ) {
    return this.usersUseCases.getOrgListByUsername(username, page, city, category);
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