import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
