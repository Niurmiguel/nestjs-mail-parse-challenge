import axios from 'axios';
import { readLocalFile, readRemoteFile } from './file.helper';
import * as fsExtra from 'fs-extra';

jest.mock('fs-extra');
jest.mock('axios');

describe('readLocalFile', () => {
    it('should read a local file', async () => {
        const filePath = '/path/to/your/local/file.txt';
        const fileContent = 'Content of the file\n';

        // Mock fsExtra.readFile to return a mocked file content
        (fsExtra.readFile as jest.MockedFunction<typeof fsExtra.readFile>).mockResolvedValue(fileContent);

        const content = await readLocalFile(filePath);
        expect(content).toEqual(fileContent);
        expect(fsExtra.readFile).toHaveBeenCalledWith(filePath, 'utf8');
    });

    it('should handle file not found error', async () => {
        const filePath = '/nonexistent/file.txt';
        const errorMessage = 'File not found';

        // Mock fsExtra.readFile to simulate a file not found error
        (fsExtra.readFile as jest.MockedFunction<typeof fsExtra.readFile>).mockRejectedValue(new Error(errorMessage));

        await expect(readLocalFile(filePath)).rejects.toThrow(`Error reading local file: ${errorMessage}`);
    });

});

describe('readRemoteFile', () => {
    it('should read a remote file', async () => {
        const url = 'https://example.com/remote-file.txt';
        const fileContent = 'Content of the remote file\n';

        // Mock axios.get to return a mocked response
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: fileContent });

        const content = await readRemoteFile(url);
        expect(content).toEqual(fileContent);
        expect(axios.get).toHaveBeenCalledWith(url);
    });

    it('should handle HTTP request error', async () => {
        const url = 'https://example.com/remote-file.txt';
        const errorMessage = 'Request failed';

        // Mock axios.get to simulate an HTTP request error
        (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(new Error(errorMessage));

        await expect(readRemoteFile(url)).rejects.toThrow(`Error reading remote file: ${errorMessage}`);
    });

});
