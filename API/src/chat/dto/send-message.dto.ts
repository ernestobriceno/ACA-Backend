import { IsMongoId, IsString } from 'class-validator';

export class SendMessageDto {
  @IsMongoId()
  roomId: string;

  @IsString()
  content: string;
}
