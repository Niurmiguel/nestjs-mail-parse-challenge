import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpException } from '@nestjs/common';
import axios from 'axios';
import { MailService } from './mail.service';

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  describe('parseEmail', () => {
    it('should parse email from local file', async () => {
      const json = await mailService.parseEmail('mock/sample-with-attachment.eml');

      expect(json).toEqual({
        "min_position": 6,
        "has_more_items": false,
        "items_html": "Bike",
        "new_latent_count": 9,
        "data": {
          "length": 25,
          "text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        "numericalArray": [
          26,
          31,
          25,
          33,
          33
        ],
        "StringArray": [
          "Oxygen",
          "Oxygen",
          "Carbon",
          "Oxygen"
        ],
        "multipleTypesArray": "Hello",
        "objArray": [
          {
            "class": "middle",
            "age": 8
          },
          {
            "class": "lower",
            "age": 9
          },
          {
            "class": "middle",
            "age": 4
          },
          {
            "class": "lower",
            "age": 7
          },
          {
            "class": "upper",
            "age": 7
          }
        ]
      });
    });

    it('should throw BadRequestException when file format is invalid', async () => {
      await expect(mailService.parseEmail('mock/sample-with-attachment.pdf')).rejects.toThrow(BadRequestException);
    });

    it('should throw HttpException when no JSON found', async () => {

      await expect(mailService.parseEmail('mock/sample-json-link.eml')).rejects.toThrow(HttpException);
    });

    it('should handle HTTP error', async () => {

      await expect(mailService.parseEmail('http://mock-remote-url')).rejects.toThrowError(HttpException);
    });

    it('should extract JSON from attachments', () => {
      const attachments = [{ contentType: 'application/json', content: Buffer.from(JSON.stringify({ test: 'json' })) }];

      const result = mailService['extractJsonFromAttachments'](attachments);
      expect(result).toEqual({ test: 'json' });
    });

    it('should extract JSON from email body', async () => {
      const emailBody = 'Contenido del email con un enlace a JSON: https://ejemplo.com/ejemplo.json';
      const mockResponse = { data: { test: 'json' } };

      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse as any);

      const result = await mailService['extractJsonFromEmailBody'](emailBody);
      expect(result).toEqual(mockResponse.data);
    });

    it('should extract JSON from redirected page', async () => {
      const emailBody = 'Contenido del email con un enlace redirigido: https://filesampleshub.com/format/code/json';
      const mockPageResponse = { data: '<html><body><a href="https://filesampleshub.com/download/code/json/sample1.json">JSON Data</a></body></html>' };
      const mockJsonResponse = { data: { test: 'json' } };

      jest.spyOn(axios, 'get').mockResolvedValueOnce(mockPageResponse as any);
      jest.spyOn(axios, 'get').mockResolvedValueOnce(mockJsonResponse as any);

      const result = await mailService['extractJsonFromRedirectedPage'](emailBody);

      expect(result).toEqual(mockJsonResponse.data);
    });
  });
});
