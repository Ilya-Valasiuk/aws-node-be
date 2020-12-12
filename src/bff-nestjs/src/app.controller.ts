import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller('*')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Req() request: Request, @Res() response): void {
    this.appService.handleRequest(request).then(data => {
      response.status(data.statusCode).json(data.response);
    })
  }

  @Post()
  createData(@Req() request: Request, @Res() response): void {
    this.appService.handleRequest(request).then(data => {
      response.status(data.statusCode).json(data.response);
    })
  }
}
