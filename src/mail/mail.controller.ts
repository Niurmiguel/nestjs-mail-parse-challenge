import { Controller, Get, Param } from '@nestjs/common';
import { AbstractMailService } from './mail.abstract';

@Controller('mail-parsing')
export class MailController {
    constructor(private readonly mailService: AbstractMailService) { }

    @Get(':urlOrPath')
    async getEmail(@Param('urlOrPath') urlOrPath: string): Promise<any> {
        return await this.mailService.parseEmail(urlOrPath);
    }
}
