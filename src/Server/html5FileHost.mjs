import http from 'http'
import https from 'https'
import express from 'express'

export default (folderPath, indexFile, sslCertPathFile, sslKeyPathFile) => {
	const httpApp = express();
	const httpsApp = express();

	const isLocalDev = !sslCertPathFile && !sslKeyPathFile;
	const app = isLocalDev ? httpApp : httpsApp;

	app.use(express.static(folderPath));
	app.get('*', function(req, res){
	  res.sendFile(indexFile);
	});

	if (!isLocalDev) {
	    httpApp.get('*', function(req, res) {
	        res.redirect('https://' + req.headers.host + req.url);
	    })
	}

	if (!isLocalDev) {
	    const options = {
	        cert: sslCertPathFile,
	        key: sslKeyPathFile,
	    };
	    https.createServer(options, app).listen(443);
	    console.log('HTTP to HTTPS redirect running')

	    http.createServer(httpApp).listen(80);
	    console.log('Proxy / file host running')
	} else {
	    http.createServer(app).listen(80);
	    console.log('Proxy / file host running')
	}

}
