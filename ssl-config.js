import { readFileSync } from 'fs'

const isProd = process.argv.includes('--prod')

let certIndex = process.argv.findIndex(arg => arg === '--ssl-cert-path')
let keyIndex = process.argv.findIndex(arg => arg === '--ssl-key-path')
const envCertPath = isProd ? process.argv[certIndex + 1] : ''
const envKeyPath = isProd ? process.argv[keyIndex + 1] : ''

export const sslConfig = {
	cert: envCertPath && readFileSync(envCertPath),
	key: envKeyPath && readFileSync(envKeyPath),
};
