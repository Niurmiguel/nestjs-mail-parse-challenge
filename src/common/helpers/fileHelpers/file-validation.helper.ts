import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

export function validateEmailFileFormat(urlOrPath: string): void {
    const fileExtension = path.extname(urlOrPath).toLowerCase();
    if (!['.eml', '.msg', '.mbox'].includes(fileExtension)) {
        throw new BadRequestException(`Invalid file format. The file extension '${fileExtension}' is not supported. Only .eml, .msg, and .mbox files are allowed.`);
    }
}