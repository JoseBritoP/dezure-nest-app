import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  create(createChatDto: CreateChatDto) {
    console.log(createChatDto)
    return 'This action adds a new chat';
  }

}
