import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('wpm')
  async getWpmLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getWpmLeaderboard(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('accuracy')
  async getAccuracyLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getAccuracyLeaderboard(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('score')
  async getScoreLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getScoreLeaderboard(
      limit ? parseInt(limit) : 10,
    );
  }
}
