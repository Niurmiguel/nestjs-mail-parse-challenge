import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { simpleParser } from 'mailparser';
import * as cheerio from 'cheerio';
import axios from 'axios';

import { readLocalFile, readRemoteFile, validateEmailFileFormat } from '../common/helpers/fileHelpers';
import { NoJsonContentException } from '../common/exception';
import { AbstractMailService } from './mail.abstract';
import { isLocalUrl } from '../common/helpers';

@Injectable()
export class MailService implements AbstractMailService {
    async parseEmail(urlOrPath: string): Promise<any> {

        validateEmailFileFormat(urlOrPath);

        try {
            const rawEmail = isLocalUrl(urlOrPath) ? await readLocalFile(urlOrPath) : await readRemoteFile(urlOrPath);
            const { attachments, text, html } = await simpleParser(rawEmail);

            const jsonContent = this.extractJsonFromAttachments(attachments) || await this.extractJsonFromEmailBody(text) || await this.extractJsonFromRedirectedPage(text);

            if (!jsonContent) {
                throw new NoJsonContentException();
            }

            return jsonContent;
        } catch (error) {
            if (error.response && error.response.status) {
                throw new HttpException(`External request failed: ${error.message}`, error.response.status);
            } else {
                throw new HttpException(`Error parsing email: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
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
}
