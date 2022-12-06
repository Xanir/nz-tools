import fs from 'fs';
import path from 'path';
import html5FileHost from './html5FileHost.mjs';

const [hostPath, hostname] = process.argv.slice(2)
const isLocalDev = hostname.startsWith('localhost')

const sslFolder = path.join(path.resolve(), '.sslcert')
function getCertFile() {
	const sslCertPath = path.join(sslFolder, 'fullchain.pem')
	return fs.readFileSync(sslCertPath)
}
function getKeyFile() {
	const sslKeyPath = path.join(sslFolder, 'privkey.pem')
	return fs.readFileSync(sslKeyPath)
}

const folderPath = path.join(path.join(path.resolve(), hostPath))
const indexFilePath = path.join(folderPath, 'index.html')
if (isLocalDev) {
	console.log(`Hosting in dev mode'`)
	html5FileHost(folderPath, indexFilePath)
} else {
	html5FileHost(folderPath, indexFilePath, getCertFile(), getKeyFile())
}
console.log(`Hosting '${folderPath}'`)
