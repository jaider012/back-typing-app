import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getWpmLeaderboard(limit: number = 10) {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore
      .collection('userStats')
      .orderBy('bestWpm', 'desc')
      .limit(limit)
      .get();

    const leaderboard = [];
    let rank = 1;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userRecord = await this.firebaseService.getUserByUid(doc.id);

      leaderboard.push({
        rank,
        uid: doc.id,
        displayName: userRecord.displayName || 'Anonymous',
        email: userRecord.email,
        wpm: data.bestWpm,
        totalTests: data.totalTests,
      });
      rank++;
    }

    return leaderboard;
  }

  async getAccuracyLeaderboard(limit: number = 10) {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore
      .collection('userStats')
      .orderBy('bestAccuracy', 'desc')
      .limit(limit)
      .get();

    const leaderboard = [];
    let rank = 1;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userRecord = await this.firebaseService.getUserByUid(doc.id);

      leaderboard.push({
        rank,
        uid: doc.id,
        displayName: userRecord.displayName || 'Anonymous',
        email: userRecord.email,
        accuracy: data.bestAccuracy,
        totalTests: data.totalTests,
      });
      rank++;
    }

    return leaderboard;
  }

  async getScoreLeaderboard(limit: number = 10) {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore
      .collection('userStats')
      .orderBy('bestScore', 'desc')
      .limit(limit)
      .get();

    const leaderboard = [];
    let rank = 1;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userRecord = await this.firebaseService.getUserByUid(doc.id);

      leaderboard.push({
        rank,
        uid: doc.id,
        displayName: userRecord.displayName || 'Anonymous',
        email: userRecord.email,
        score: data.bestScore,
        totalTests: data.totalTests,
      });
      rank++;
    }

    return leaderboard;
  }
}
