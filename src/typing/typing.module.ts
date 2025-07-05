import { Module } from '@nestjs/common';
import { TypingController } from './typing.controller';
import { TypingService } from './typing.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [TypingController],
  providers: [TypingService],
  exports: [TypingService],
})
export class TypingModule {}
