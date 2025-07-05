import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateTestDto } from './dto/create-typing.dto';

@Injectable()
export class TypingService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createTypingTest(uid: string, createTestDto: CreateTestDto) {
    const firestore = this.firebaseService.getFirestore();
    const testData = {
      ...createTestDto,
      uid,
      createdAt: new Date().toISOString(),
    };

    const testRef = await firestore.collection('TypingTests').add(testData);

    // Update user stats
    await this.updateUserStats(uid, createTestDto);

    return {
      id: testRef.id,
      ...testData,
    };
  }

  async getUserTypingTests(uid: string, limit: number = 10) {
    const firestore = this.firebaseService.getFirestore();
    const testsRef = firestore
      .collection('tests')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    const snapshot = await testsRef.get();
    const tests = [];

    snapshot.forEach((doc) => {
      tests.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return tests;
  }

  async getUserStats(uid: string) {
    const firestore = this.firebaseService.getFirestore();
    const userStatsRef = firestore.collection('userStats').doc(uid);
    const doc = await userStatsRef.get();

    if (!doc.exists) {
      return {
        totalTests: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        bestScore: 0,
        averageWpm: 0,
        averageAccuracy: 0,
      };
    }

    return doc.data();
  }

  private async updateUserStats(uid: string, testData: CreateTestDto) {
    const firestore = this.firebaseService.getFirestore();
    const userStatsRef = firestore.collection('userStats').doc(uid);

    const doc = await userStatsRef.get();
    const currentStats = doc.exists
      ? doc.data()
      : {
          totalTests: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          bestScore: 0,
          totalWpm: 0,
          totalAccuracy: 0,
        };

    const newStats = {
      totalTests: currentStats.totalTests + 1,
      bestWpm: Math.max(currentStats.bestWpm, testData.wpm),
      bestAccuracy: Math.max(currentStats.bestAccuracy, testData.accuracy),
      bestScore: Math.max(currentStats.bestScore, testData.score),
      totalWpm: currentStats.totalWpm + testData.wpm,
      totalAccuracy: currentStats.totalAccuracy + testData.accuracy,
      averageWpm: Math.round(
        (currentStats.totalWpm + testData.wpm) / (currentStats.totalTests + 1),
      ),
      averageAccuracy: Math.round(
        (currentStats.totalAccuracy + testData.accuracy) /
          (currentStats.totalTests + 1),
      ),
      updatedAt: new Date().toISOString(),
    };

    await userStatsRef.set(newStats);
  }
}
