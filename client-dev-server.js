import liveServer from 'live-server'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sslConfig = {
	cert: readFileSync(join(__dirname, 'localhost.cert')),
	key: readFileSync(join(__dirname, 'localhost.key')),
};
 
var params = {
	port: 5500,
	host: '0.0.0.0',
	root: './client',
	open: false,
	mount: [['/shared', './shared']],
	logLevel: 2,
	cors: true,
	watch: './client',
	https: sslConfig
};
liveServer.start(params);