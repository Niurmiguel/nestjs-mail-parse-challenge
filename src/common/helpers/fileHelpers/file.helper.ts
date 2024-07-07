import * as fs from 'fs-extra';
import axios from 'axios';

export async function readLocalFile(urlOrPath: string): Promise<string> {
    try {
        return await fs.readFile(urlOrPath, 'utf8');
    } catch (error) {
        throw new Error(`Error reading local file: ${error.message}`);
    }
}

export async function readRemoteFile(urlOrPath: string): Promise<string> {
    try {
        const response = await axios.get(urlOrPath);
        return response.data;
    } catch (error) {
        throw new Error(`Error reading remote file: ${error.message}`);
    }
}