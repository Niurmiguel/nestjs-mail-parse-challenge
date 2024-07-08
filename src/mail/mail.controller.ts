import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AbstractMailService } from './mail.abstract';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: AbstractMailService) { }

    @Get('parsing')
    async getEmail(@Query('urlOrPath') urlOrPath: string): Promise<any> {
        if (!urlOrPath) {
            throw new BadRequestException('Missing urlOrPath query parameter');
        }

        return await this.mailService.parseEmail(urlOrPath);
    }
}
