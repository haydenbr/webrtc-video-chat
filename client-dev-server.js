import liveServer from 'live-server'
import { sslConfig } from './ssl-config.js'

const prod = !!process.argv.includes('--prod')
const port = prod ? 443 : 5500
 
liveServer.start({
	port,
	host: '0.0.0.0',
	root: './client',
	open: false,
	logLevel: prod ? 0 : 2,
	cors: true,
	watch: prod ? undefined : './client',
	https: sslConfig
});