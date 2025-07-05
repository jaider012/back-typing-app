import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    const serviceAccount = this.configService.get('FIREBASE_SERVICE_ACCOUNT');

    if (!serviceAccount) {
      throw new Error('Firebase service account configuration not found');
    }

    // Parse service account JSON if it's a string
    const serviceAccountConfig =
      typeof serviceAccount === 'string'
        ? JSON.parse(serviceAccount)
        : serviceAccount;

    const initConfig: admin.AppOptions = {
      credential: admin.credential.cert(serviceAccountConfig),
    };

    // Only add databaseURL if it's provided (for Realtime Database)
    const databaseURL = this.configService.get('FIREBASE_DATABASE_URL');
    if (databaseURL) {
      initConfig.databaseURL = databaseURL;
    }

    this.app = admin.initializeApp(initConfig);
  }

  getAuth(): admin.auth.Auth {
    return this.app.auth();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.app.firestore();
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.getAuth().verifyIdToken(idToken);
    } catch (error) {
      throw new Error(`Invalid Firebase token: ${error.message}`);
    }
  }

  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.getAuth().getUser(uid);
    } catch (error) {
      throw new Error(`User not found: ${error.message}`);
    }
  }
}
