import liveServer from 'live-server'
import { sslConfig } from './ssl-config.js'
 
liveServer.start({
	port: 5500,
	host: '0.0.0.0',
	root: './client',
	open: false,
	mount: [['/shared', './shared']],
	logLevel: 2,
	cors: true,
	watch: './client',
	https: sslConfig
});