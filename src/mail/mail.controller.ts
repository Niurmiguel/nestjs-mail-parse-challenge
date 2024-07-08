import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AbstractMailService } from './mail.abstract';
import { ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: AbstractMailService) { }

    @Get('parsing')
    @ApiResponse({ status: 200, description: 'Returns JSON content extracted from email' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiQuery({ name: 'urlOrPath', type: String, description: 'URL or local path of the email' })
    async getEmail(@Query('urlOrPath') urlOrPath: string): Promise<any> {
        if (!urlOrPath) {
            throw new BadRequestException('Missing urlOrPath query parameter');
        }

        return await this.mailService.parseEmail(urlOrPath);
    }
}
