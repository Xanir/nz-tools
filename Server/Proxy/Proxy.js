
var CharMap = require('./../CharTree');
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
        try {
            var closestMatch = proxyByPath.findClosestNodeWithActions(req.url);

            if (closestMatch) {
                res.setHeader('proxy-status', 'match-found')
                var redirectBasePath = closestMatch.getFullPath();

                var redirectUrl = closestMatch.getActions()[0];

                req.url = req.url.slice(redirectBasePath.length);
                req.url = req.url ? req.url : '/';
                proxyBind(redirectUrl, req, res);

                res.setHeader('proxy-status', 'connected')
                return true;
            }
        } catch (e) {
            console.error(e)
        }
        return false;
    }

}

module.exports = ProxyConfig;
