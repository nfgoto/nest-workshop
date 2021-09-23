import { Injectable } from "@nestjs/common";
import { readFile, writeFile } from "fs/promises";

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(contents);

    return messages[id];
  }

  async findAll() {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(contents);

    return messages;
  }

  async create(content: string) {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = contents ? JSON.parse(contents) : {};

    const id = Math.floor(Math.random() * 999 + 1)
    messages[id] = { id, content };

    await writeFile('messages.json', JSON.stringify(messages))
  }
}