import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import axios from 'axios';
import { simpleParser } from 'mailparser';
import * as path from 'path';
import * as cheerio from 'cheerio';

import { AbstractMailService } from './mail.abstract';

@Injectable()
export class MailService implements AbstractMailService {
    async parseEmail(urlOrPath: string): Promise<any> {
        const fileExtension = path.extname(urlOrPath).toLowerCase();

        if (!['.eml', '.msg', '.mbox'].includes(fileExtension)) {
            throw new BadRequestException('Invalid file format. Only .eml, .msg, and .mbox files are allowed.');
        }

        try {
            const rawEmail = this.isLocalUrl(urlOrPath) ? await this.readLocalFile(urlOrPath) : await this.readRemoteFile(urlOrPath);
            const { attachments, text, html } = await simpleParser(rawEmail);

            const jsonContent = this.extractJsonFromAttachments(attachments) || await this.extractJsonFromEmailBody(text) || await this.extractJsonFromRedirectedPage(text);

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

    private async extractJsonFromEmailBody(emailBody: string): Promise<any> {
        const regex = /\bhttps?:\/\/\S+?\.json\b/g;
        const match = emailBody.match(regex);
        if (match && match[0]) {
            const jsonUrl = match[0];
            const response = await axios.get(jsonUrl);
            return response.data;
        }

        return null;
    }

    private async extractJsonFromRedirectedPage(emailBody: string): Promise<any> {
        try {
            const regex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/gi;
            const matches = emailBody.match(regex) || [];

            if (matches && matches[0]) {
                const response = await axios.get(matches[0]);
                const $ = cheerio.load(response.data);
                let jsonLink = $('a[href$=".json"]').attr('href');
                if (!jsonLink) {
                    throw new Error('A JSON link was not found in the redirected page.');
                }
                if (jsonLink.startsWith('/')) {
                    jsonLink = `${response.request.protocol}//${response.request.host}${jsonLink}`
                }
                const jsonResponse = await axios.get(jsonLink);
                return jsonResponse.data;
            }

            return null;

        } catch (error) {
            console.error('Error extracting JSON from redirected page:', error.message);
            return null;
        }
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
