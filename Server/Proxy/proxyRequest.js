
const URL = require('url');
const HTTPS = require('https');
const HTTP = require('http');

const getUrlOptions = function(url) {
    var httpParams = URL.parse(url);
    delete httpParams.host;
    delete httpParams.href;
    delete httpParams.path;
    for (key in httpParams) {
        if (!httpParams[key]) {delete httpParams[key]}
    }

    return httpParams;
}

const buildRediredUrlOptions = function(url, request) {
    var baseUrlOptions = URL.parse(url);
    var requestParams = getUrlOptions(request.url);
    requestParams.protocol = baseUrlOptions.protocol;
    requestParams.hostname = baseUrlOptions.hostname;
    requestParams.port = baseUrlOptions.port;

    var urlPathPrefix = baseUrlOptions.pathname || '';
    // Remove tailing slash
    urlPathPrefix = urlPathPrefix.replace(/\/$/, '');

    var urlPath = requestParams.pathname || '';
    // Remove prefixed slash
    urlPath = urlPath.replace(/^\//, '');

    requestParams.pathname = urlPathPrefix + '/' + urlPath;

    requestParams = URL.parse(URL.format(requestParams));
    requestParams.method = request.method;
    requestParams.headers = request.headers;

    return requestParams;
}

module.exports = function(url, request, response) {
		request.pause();

    var redirectUrlOptions = buildRediredUrlOptions(url, request);

    // Override host for SSL cert validation
    redirectUrlOptions.headers.host = redirectUrlOptions.hostname

    response.setHeader('proxy-url', URL.format(redirectUrlOptions));

    var r = redirectUrlOptions.protocol === 'https:' ? HTTPS : HTTP
	var pRequest = r.request(redirectUrlOptions, (pResponse) => {
        response.setHeader('proxy-status', 'binding connections')
        pResponse.pause();
        Object.keys(pResponse.headers).forEach(h => {
            response.setHeader(h, pResponse.headers[h]);
        })
        pResponse.pipe(response)
        response.statusCode = pResponse.statusCode;
        response.setHeader('proxy-status', 'recieving data')
        pResponse.resume();
	});

	request.pipe(pRequest);
    response.setHeader('proxy-status', 'sending data')
	request.resume();

	pRequest.on('error', (err) => {
        response.setHeader('proxy-error', err)
        response.statusCode = 500;
        response.end();
    })
}
