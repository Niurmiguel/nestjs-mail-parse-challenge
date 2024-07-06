import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AbstractMailService } from './mail.abstract';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: AbstractMailService) { }

    @Get('parsing')
    async getEmail(@Query('urlOrPath') urlOrPath: string): Promise<any> {
        try {
            const jsonContent = await this.mailService.parseEmail(urlOrPath);
            return jsonContent;
        } catch (error) {
            // Handle specific errors or generalize as needed
            throw new HttpException(`Failed to parse email: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
