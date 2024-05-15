import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class ChatService {
  async create(createChatDto: CreateChatDto) {
    const chat = new ChatOpenAI({
      temperature:0.5,
      model:'gpt-3.5-turbo-0125',
      openAIApiKey:process.env.OPENAI_APIKEY
    })
    const stream = await chat.stream([['human',createChatDto.message]]);

    for await(const chunk of stream){
      console.log(chunk)
    }
    console.log(createChatDto)
    return 'This action adds a new chat';
  }
}
