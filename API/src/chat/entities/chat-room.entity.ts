import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  users: Types.ObjectId[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
