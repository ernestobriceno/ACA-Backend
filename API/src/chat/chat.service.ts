import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ToxicityDetectorService } from 'src/toxicity-detector/services/toxicity-detector.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatRoom, ChatRoomDocument } from './entities/chat-room.entity';
import {
  ChatMessage,
  ChatMessageDocument,
} from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly roomModel: Model<ChatRoomDocument>,
    @InjectModel(ChatMessage.name)
    private readonly messageModel: Model<ChatMessageDocument>,
    private readonly toxicityService: ToxicityDetectorService,
  ) {}

  async createRoom(userId: Types.ObjectId, dto: CreateRoomDto) {
    const room = new this.roomModel({ ...dto, users: [userId] });
    return room.save();
  }

  async joinRoom(roomId: Types.ObjectId, userId: Types.ObjectId) {
    const room = await this.roomModel.findById(roomId);
    if (!room) throw new NotFoundException('Room not found');
    if (!room.users.some((id) => id.equals(userId))) {
      room.users.push(userId);
      await room.save();
    }
    return room;
  }

  async sendMessage(userId: Types.ObjectId, dto: SendMessageDto) {
    const room = await this.roomModel.findById(dto.roomId);
    if (!room) throw new NotFoundException('Room not found');
    if (!room.users.some((id) => id.equals(userId))) {
      throw new ForbiddenException('Access denied to this room');
    }
    const { isToxic } = await this.toxicityService.getToxicityClassification(
      dto.content,
    );
    const message = new this.messageModel({
      content: dto.content,
      room: room._id,
      user: userId,
      blocked: isToxic,
    });
    await message.save();
    return message;
  }
}
