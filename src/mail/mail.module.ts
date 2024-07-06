import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { AbstractMailService } from './mail.abstract';

@Module({
  providers: [MailService, { provide: AbstractMailService, useClass: MailService }],
  controllers: [MailController],
})
export class MailModule { }
