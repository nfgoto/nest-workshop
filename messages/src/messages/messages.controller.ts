import { Header, HttpCode, NotFoundException, Put } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { EditMessageDto } from './dtos/edit-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get()
  async listMessages() {
    return this.messagesService.findAll()
  }

  @Post()
  async createMessage(@Body() { content }: CreateMessageDto) {
    await this.messagesService.create(content);
  }

  @Get('/:id')
  async getMessage(@Param('id') id: string) {
    const msg = await this.messagesService.findOne(id);
    if (!msg) {
      throw new NotFoundException('message not found');
    }
    return msg;
  }

  @Put('/:id')
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  async editMessage(
    @Param('id') id: string,
    @Body() { content }: EditMessageDto
  ) {
    return this.messagesService.edit(id, content);
  }
}
