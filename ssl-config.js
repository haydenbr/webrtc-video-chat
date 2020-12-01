import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const sslConfig = {
	cert: readFileSync(join(__dirname, 'localhost.cert')),
	key: readFileSync(join(__dirname, 'localhost.key')),
};
