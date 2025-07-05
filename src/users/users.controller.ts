import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findUserByUid(req.user.uid);
  }
}
