import { isLocalUrl } from './url.helper';

describe('isLocalUrl', () => {
    it('should return true for local URLs', () => {
        const localUrls = [
            '/path/to/resource',
            '/another/path',
            '/relative/url',
        ];

        localUrls.forEach(url => {
            expect(isLocalUrl(url)).toBe(true);
        });
    });

    it('should return false for external URLs', () => {
        const externalUrls = [
            'http://example.com',
            'https://www.google.com',
            'ftp://ftp.server.com/file',
        ];

        externalUrls.forEach(url => {
            expect(isLocalUrl(url)).toBe(false);
        });
    });
});
