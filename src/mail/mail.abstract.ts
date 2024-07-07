import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AbstractMailService {
    abstract parseEmail(urlOrPath: string): Promise<any>;
}