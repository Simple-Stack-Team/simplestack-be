import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { IChatRequest, IChatResponse } from 'src/openai/types/openai-types';

@Injectable()
export class OpenaiService {
  private openAIService: OpenAI;
  constructor(private configService: ConfigService) {
    this.openAIService = new OpenAI({
      apiKey: this.configService.get('OPENAI_KEY'),
    });
  }

  async getMessageData(request: IChatRequest): Promise<OpenAI.ChatCompletion> {
    return this.openAIService.chat.completions.create({
      model: this.configService.get('GPT_MODEL'),
      messages: request.messages,
      response_format: { type: 'json_object' },
    });
  }

  getChatOpenaiResponse(message: OpenAI.ChatCompletion): IChatResponse {
    return {
      success: true,
      result: message?.choices.length && message?.choices[0],
    };
  }
}
