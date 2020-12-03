import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultCertPath = join(__dirname, 'localhost.cert')
const defaultKeyPath = join(__dirname, 'localhost.key')

const envCertPath = process.env.SSL_CERT_PATH
const envKeyPath = process.env.SSL_KEY_PATH

export const sslConfig = {
	cert: readFileSync(envCertPath || defaultCertPath),
	key: readFileSync(envKeyPath || defaultKeyPath),
};
