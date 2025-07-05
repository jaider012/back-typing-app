import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { TypingService } from './typing.service';
import { CreateTestDto } from './dto/create-typing.dto';

@Controller('typing')
@UseGuards(FirebaseAuthGuard)
export class TypingController {
  constructor(private readonly typingService: TypingService) {}

  @Post()
  async createTest(@Request() req, @Body() createTestDto: CreateTestDto) {
    return this.typingService.createTypingTest(req.user.uid, createTestDto);
  }

  @Get()
  async getUserTyping(@Request() req, @Query('limit') limit?: string) {
    return this.typingService.getUserTypingTests(
      req.user.uid,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('stats')
  async getUserStats(@Request() req) {
    return this.typingService.getUserStats(req.user.uid);
  }
}
