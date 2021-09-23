import { Controller, Get } from "@nestjs/common";

@Controller('/app')
export class AppController {
  @Get('/hi')
  getHi() { return 'hi there!' }

  @Get('/bye')
  getBye() { return 'bye there!' }
}