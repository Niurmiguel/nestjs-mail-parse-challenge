import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MailService } from './../src/mail/mail.service';

describe('MailController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET mail/parsing', () => {
    it('should return 400 if urlOrPath query parameter is missing', async () => {
      const response = await request(app.getHttpServer())
        .get('/mail/parsing')
        .expect(400);

      expect(response.body.message).toEqual('Missing urlOrPath query parameter');
    });

    it('should return JSON content when valid urlOrPath is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/mail/parsing?urlOrPath=mock/sample-with-attachment.eml')
        .expect(200);


      expect(response.body).toEqual({
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

    it('should return 500 if No JSON content was found in the email', async () => {
      const mockService = app.get<MailService>(MailService);
      jest.spyOn(mockService, 'parseEmail').mockResolvedValue({ key: 'value' });

      const response = await request(app.getHttpServer())
        .get('/mail/parsing?urlOrPath=https://www.phpclasses.org/browse/download/1/file/14672/name/test%2Fsample%2Fmessage.eml')
        .expect(500);

      expect(response.body.message).toEqual('Error parsing email: No JSON content was found in the email.');
    });
  });
});
