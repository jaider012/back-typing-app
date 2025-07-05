import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { FirebaseHealthIndicator } from './firebase-health.indicator';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [TerminusModule, FirebaseModule],
  controllers: [HealthController, MetricsController],
  providers: [FirebaseHealthIndicator],
})
export class HealthModule {}
