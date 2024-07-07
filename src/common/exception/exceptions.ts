import { BadRequestException } from '@nestjs/common';

export class NoJsonContentException extends BadRequestException {
    constructor() {
        super('No JSON content was found in the email.');
    }
}
