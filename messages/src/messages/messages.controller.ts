import { NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(protected messagesService: MessagesService) { }

  @Get()
  async listMessages() {
    return this.messagesService.findAll()
  }

  @Post()
  async createMessage(@Body() body: CreateMessageDto) {
    await this.messagesService.create(body.content);
  }

  @Get('/:id')
  async getMessage(@Param('id') id: string) {
    const msg = await this.messagesService.findOne(id);
    if (!msg) {
      throw new NotFoundException('message not found');
    }
    return msg;
  }
}
