import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import axios from 'axios';

import { AbstractMailService } from './mail.abstract';

@Injectable()
export class MailService implements AbstractMailService {
    async parseEmail(urlOrPath: string): Promise<any> {
        try {
            const rawEmail = this.isLocalUrl(urlOrPath) ? await this.readLocalFile(urlOrPath) : await this.readRemoteFile(urlOrPath)

            return rawEmail;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async readLocalFile(urlOrPath: string): Promise<string> {
        try {
            return fs.readFileSync(urlOrPath, 'utf8');
        } catch (error) {
            throw new Error(`Error reading local file: ${error.message}`);
        }
    }

    async readRemoteFile(urlOrPath: string): Promise<string> {
        try {
            const response = await axios.get(urlOrPath);
            console.log('Contenido del archivo remoto:');
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw new Error(`Error reading remote file: ${error.message}`);
        }
    }

    isLocalUrl(urlOrPath: string): boolean {
        if (urlOrPath.startsWith('file://') || urlOrPath.startsWith('http://localhost') || urlOrPath.startsWith('http://127.0.0.1') || !urlOrPath.includes('://')) {
            return true;
        }

        return false;
    }
}
