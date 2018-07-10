
const URL = require('url');
const HTTPS = require('https');
const HTTP = require('http');

const getUrlOptions = function(url) {
  	var httpParams = URL.parse(url);
  	delete httpParams.host;
  	delete httpParams.href;
  	delete httpParams.pathname;
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

    var urlPath = requestParams.path || '';
    // Remove prefixed slash
    urlPath = urlPath.replace(/^\//, '');

    requestParams.path = urlPathPrefix + '/' + urlPath;

    requestParams.method = request.method;
    requestParams.headers = request.headers;

    return requestParams;
}

module.exports = function(url, request, response) {
		request.pause();

    var redirectUrlOptions = buildRediredUrlOptions(url, request);
    redirectUrlOptions.pathname = redirectUrlOptions.path;
    response.setHeader('proxy-url', URL.format(redirectUrlOptions));

		var pRequest = HTTP.request(redirectUrlOptions, (pResponse) => {
			   pResponse.pipe(response)
		});

		request.pipe(pRequest);
		request.resume()

		pRequest.on('error', () => {
      console.log('ERROR')
        response.statusCode = 500;
        response.end();
    })
}
