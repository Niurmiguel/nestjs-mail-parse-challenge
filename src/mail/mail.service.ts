import { Injectable } from '@nestjs/common';
import { AbstractMailService } from './mail.abstract';

@Injectable()
export class MailService implements AbstractMailService {
    parseEmail(urlOrPath: string): Promise<any> {
        return null
    }
}
