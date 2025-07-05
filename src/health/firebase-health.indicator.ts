import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FirebaseHealthIndicator extends HealthIndicator {
  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Test Firebase Auth connection
      await this.firebaseService.getAuth().listUsers(1);

      // Test Firestore connection
      const firestore = this.firebaseService.getFirestore();
      await firestore.collection('health-check').limit(1).get();

      return this.getStatus(key, true, {
        auth: 'connected',
        firestore: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const result = this.getStatus(key, false, {
        auth: 'disconnected',
        firestore: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      throw new HealthCheckError('Firebase check failed', result);
    }
  }
} 