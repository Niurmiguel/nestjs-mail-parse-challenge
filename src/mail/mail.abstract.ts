import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AbstractMailService {
    abstract parseEmail(urlOrPath: string): Promise<any>;
    abstract readLocalFile(urlOrPath: string): Promise<string>;
    abstract readRemoteFile(urlOrPath: string): Promise<string>;
}