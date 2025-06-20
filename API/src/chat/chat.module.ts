import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToxicityDetectorModule } from 'src/toxicity-detector/toxicity-detector.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
    ToxicityDetectorModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
