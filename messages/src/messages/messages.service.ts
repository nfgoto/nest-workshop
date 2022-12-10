import { Injectable } from "@nestjs/common";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService {
  constructor(protected messagesRepository: MessagesRepository) { }

  findOne(id: string) {
    return this.messagesRepository.findOne(id)
  }

  findAll() {
    return this.messagesRepository.findAll()
  }

  create(content: string) {
    return this.messagesRepository.create(content)
  }

  edit(id: string, content: string) {
    return this.messagesRepository.edit(id, content)
  }
}