import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { AbstractMailService } from './mail.abstract';
import { BadRequestException } from '@nestjs/common';
import { NoJsonContentException } from '@common/exception';

describe('MailController', () => {
  let controller: MailController;
  let mailService: AbstractMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: AbstractMailService,
          useValue: {
            parseEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    mailService = module.get<AbstractMailService>(AbstractMailService);
  });

  describe('getEmail', () => {
    it('should return parsed email content', async () => {
      const expectedContent = {};
      jest.spyOn(mailService, 'parseEmail').mockResolvedValue(expectedContent);

      const urlOrPath = 'https://example.com/email-file.eml';
      const result = await controller.getEmail(urlOrPath);

      expect(result).toBe(expectedContent);
    });

    it('should throw BadRequestException if urlOrPath is missing', async () => {
      const urlOrPath = undefined;

      await expect(controller.getEmail(urlOrPath)).rejects.toThrow(BadRequestException);
    });

    it('should handle NoJsonContentException from service', async () => {
      const urlOrPath = 'https://example.com/email-file.eml';

      jest.spyOn(mailService, 'parseEmail').mockRejectedValue(new NoJsonContentException());

      await expect(controller.getEmail(urlOrPath)).rejects.toThrow(NoJsonContentException);
    });


  });
});
