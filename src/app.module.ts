import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypingModule } from './typing/typing.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { HealthModule } from './health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    FirebaseModule,
    AuthModule,
    UsersModule,
    TypingModule,
    LeaderboardModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
