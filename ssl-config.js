import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultCertPath = join(__dirname, 'localhost.cert')
const defaultKeyPath = join(__dirname, 'localhost.key')

const isProd = process.argv.includes('--prod')

let certIndex = process.argv.findIndex('--ssl-cert-path')
let keyIndex = process.argv.findIndex('--ssl-key-path')
const envCertPath = isProd ? process.argv[certIndex + 1] : ''
const envKeyPath = isProd ? process.argv[keyIndex + 1] : ''

// console.log(envCertPath)
console.log(process.env.argv)

export const sslConfig = {
	cert: readFileSync(envCertPath || defaultCertPath),
	key: readFileSync(envKeyPath || defaultKeyPath),
};
