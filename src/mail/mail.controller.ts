import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractMailService } from './mail.abstract';

@Controller('mail-parsing')
export class MailController {
    constructor(private readonly mailService: AbstractMailService) { }

    @Get(':urlOrPath')
    async getEmail(@Param('urlOrPath') urlOrPath: string): Promise<any> {
        try {
            const parsedEmail = await this.mailService.parseEmail(urlOrPath);
            return parsedEmail;
        } catch (error) {
            // Handle specific errors or generalize as needed
            throw new HttpException(`Failed to parse email: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
