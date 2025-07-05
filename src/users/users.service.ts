import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findUserByUid(uid: string) {
    try {
      const userRecord = await this.firebaseService.getUserByUid(uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime,
      };
    } catch (error) {
      throw new Error(`User not found: ${error.message}`);
    }
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
}