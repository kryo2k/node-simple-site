(function(_, _s, http, paperboy, httpcodes, log){

    var
    port = null,
    addr = null,
    webroot = null,
    poweredby = 'Atari';

    function httpcodestr(code) {
        return httpcodes[code]||'unknown';
    }
    function httperror(code,arg) {
        return 'Error [' + code + ']: ' + _s.sprintf(httpcodestr(code), arg);
    }

    function Server(req, res) {

        var
        ip = req.connection.remoteAddress;

        paperboy
            .deliver(webroot, req, res)
            .addHeader('X-Powered-By', poweredby)
            .before(function() {
                log.debug('Request received for ' + req.url);
            })
            .after(function(statusCode) {
                log.info(statusCode + ' - ' + req.url + ' => ' + ip);
            })
            .error(function(statusCode, msg) {
                log.warn(statusCode, msg, req.url, ip);
                res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
                res.end(httperror(statusCode));
            })
            .otherwise(function(err) {
                var code = 404;
                log.warn(code, err, req.url, ip);
                res.writeHead(code, { 'Content-Type': 'text/plain' });
                res.end(httperror(code,req.url));
            });
    }

    _.extend(exports,{
        configure: function(cfg){
            cfg = cfg || {};
            log.debug("Configuring server:",cfg);
            if(cfg.port) {
                port = cfg.port;
            }
            if(cfg.addr) {
                addr = cfg.addr;
            }
            if(cfg.webroot) {
                webroot = cfg.webroot;
            }
        },
        start: function(){
            var
            host = addr+":"+port;

            if(port === null || host === null) {
                log.error("HTTP server was not configured correctly.");
                throw "Server configuration is missing a port and/or host configuration.";
                return false;
            }

            log.debug("Starting server on", host);

            http.createServer( Server ).listen(port, addr);

            log.info("Server running on", host);

            return http;
        },
        stop: function(){
            log.debug("Stopping server");
        }
    });
})(
    require('underscore'),
    require('underscore.string'),
    require('http'),
    require('paperboy'),
    require('./server/httpcodes.js'),
    require('./log.js')
);