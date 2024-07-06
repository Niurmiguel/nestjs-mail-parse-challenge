import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import axios from 'axios';
import { simpleParser } from 'mailparser';

import { AbstractMailService } from './mail.abstract';

@Injectable()
export class MailService implements AbstractMailService {
    async parseEmail(urlOrPath: string): Promise<any> {
        try {
            const rawEmail = this.isLocalUrl(urlOrPath) ? await this.readLocalFile(urlOrPath) : await this.readRemoteFile(urlOrPath);
            const { attachments, text, html } = await simpleParser(rawEmail);

            const jsonContent = this.extractJsonFromAttachments(attachments);

            return jsonContent;
        } catch (error) {
            throw new HttpException(`Error parsing email: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private extractJsonFromAttachments(attachments: any[]): any {
        if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
                if (attachment.contentType === 'application/json') {
                    return JSON.parse(attachment.content.toString());
                }
            }
        }
        return null;
    }

    async readLocalFile(urlOrPath: string): Promise<string> {
        try {
            return await fs.readFile(urlOrPath, 'utf8');
        } catch (error) {
            throw new Error(`Error reading local file: ${error.message}`);
        }
    }

    async readRemoteFile(urlOrPath: string): Promise<string> {
        try {
            const response = await axios.get(urlOrPath);
            return response.data;
        } catch (error) {
            throw new Error(`Error reading remote file: ${error.message}`);
        }
    }

    isLocalUrl(urlOrPath: string): boolean {
        return !urlOrPath.includes('://') || urlOrPath.startsWith('file://') || urlOrPath.startsWith('http://localhost') || urlOrPath.startsWith('http://127.0.0.1');
    }
}
