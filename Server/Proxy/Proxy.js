
var CharMap = require('./../charMap');
var proxyBind = require('./proxyRequest');

const ProxyConfig = function(redirectMap) {
    var service = this;

    var proxyByPath = new CharMap();
    for (path in redirectMap) {
        proxyByPath.addAction(path, redirectMap[path]);
    }

    service.getProxyRoutes = function() {
        var registeredRoutes = proxyByPath.getActionNodes();
        return registeredRoutes.map(function(node) {
            return {
                local: node.getFullPath(),
                remote: node.getActions()[0],
            }
        })
    };

    service.attemptProxy = function(req, res) {
        var closestMatch = proxyByPath.findClosestAction(req.url);
        if (closestMatch) {
            var redirectBasePath = closestMatch.getFullPath();

            var redirectUrl = closestMatch.getActions()[0];

            req.url = req.url.slice(redirectBasePath.length);
            req.url = req.url ? req.url : '/';
            proxyBind(redirectUrl, req, res);

            return true;
        } else {
            return false;
        }
    }

}

module.exports = ProxyConfig;
