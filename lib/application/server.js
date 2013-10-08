(function(_, http, log){

    function Server(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    }

    var
    port = null,
    addr = null;

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
    require('http'),
    require('./log.js')
);