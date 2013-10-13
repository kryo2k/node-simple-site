global.httpErrorCodes = {

    // 1xx informational
    100: 'Client should continue with request',
    101: 'Server is switching protocols',
    102: 'Server has received and is processing the request',
    103: 'Resume aborted PUT or POST requests',
    122: 'URI is longer than a maximum of 2083 characters',

    // 2xx success
    200: 'Success',
    201: 'Request has been fulfilled; new resource created',
    202: 'Request accepted, processing pending',
    203: 'Request processed, information may be from another source',
    204: 'Request processed, no content returned',
    205: 'Request processed, no content returned, reset document view',
    206: 'Partial resource return due to request header',
    207: 'XMLl, can contain multiple separate responses',
    208: 'results previously returned',
    226: 'request fulfilled, reponse is instance-manipulations',

    // 3xx redirection
    300: 'Multiple options for the resource delivered',
    301: 'This and all future requests directed to the given URI',
    302: 'Temporary response to request found via alternative URI',
    303: 'Permanent response to request found via alternative URI',
    304: 'Resource has not been modified since last requested',
    305: 'Content located elsewhere, retrieve from there',
    306: 'Subsequent requests should use the specified proxy',
    307: 'Connect again to different uri as provided',
    308: 'Resumable HTTP Requests',

    // 4xx client error
    400: 'Request cannot be fulfilled due to bad syntax',
    401: 'Authentication is possible but has failed',
    402: 'Payment required, reserved for future use',
    403: 'Server refuses to respond to request',
    404: 'Requested resource (%s) could not be found',
    405: 'Request method not supported by that resource',
    406: 'Content not acceptable according to the Accept headers',
    407: 'Client must first authenticate itself with the proxy',
    408: 'Server timed out waiting for the request',
    409: 'Request could not be processed because of conflict',
    410: 'Resource is no longer available and will not be available again',
    411: 'Request did not specify the length of its content',
    412: 'Server does not meet request preconditions',
    413: 'Request is larger than the server is willing or able to process',
    414: 'URI provided was too long for the server to process',
    415: 'Server does not support media type',
    416: 'Client has asked for unprovidable portion of the file',
    417: 'Server cannot meet requirements of Expect request-header field',
    418: 'I\'m a teapot',
    420: 'Twitter rate limiting',
    422: 'Request unable to be followed due to semantic errors',
    423: 'Resource that is being accessed is locked',
    424: 'Request failed due to failure of a previous request',
    426: 'Client should switch to a different protocol',
    428: 'Origin server requires the request to be conditional',
    429: 'User has sent too many requests in a given amount of time',
    431: 'Server is unwilling to process the request',
    444: 'Server returns no information and closes the connection',
    449: 'Request should be retried after performing action',
    450: 'Windows Parental Controls blocking access to webpage',
    451: 'The server cannot reach the client\'s mailbox.',
    499: 'Connection closed by client while HTTP server is processing',

    // 5xx server error
    500: 'Generic error message',
    501: 'Server does not recognise method or lacks ability to fulfill',
    502: 'Server received an invalid response from upstream server',
    503: 'Server is currently unavailable',
    504: 'Gateway did not receive response from upstream server',
    505: 'Server does not support the HTTP protocol version',
    506: 'Content negotiation for the request results in a circular reference',
    507: 'Server is unable to store the representation',
    508: 'Server detected an infinite loop while processing the request',
    509: 'Bandwidth limit exceeded',
    510: 'Further extensions to the request are required',
    511: 'Client needs to authenticate to gain network access',
    598: 'Network read timeout behind the proxy',
    599: 'Network connect timeout behind the proxy'
};

(function(util, events, _, http, paperboy){

    function Webserver() {
        events.EventEmitter.call(this);
        return this;
    }

    // inherit constructor from event emitter.
    util.inherits(Webserver, events.EventEmitter);

    function httpcodestr(code) {
        return global.httpErrorCodes[code]||'unknown';
    }
    function httpmsg(code) {
        return util.format('[%d] - %s', code, httpcodestr(code));
    }
    function httperror(code) {
        return util.format('[%d] Error - %s', code, httpcodestr(code));
    }
    function httperrorf() {
        var
        args = Array.prototype.slice.call(arguments),
        code = args.shift();
        args.unshift(httperror(code));
        return util.format.apply(util, args);
    }

    var
    port = null,
    addr = null,
    webroot = null,
    poweredby = 'Atari',
    server = null,
    instance = null;

    _.extend(Webserver, {
        PaperboyServer: function(req, res){

            var
            self = instance,
            ip = req.connection.remoteAddress,
            serverReqMsg = function(status) {
                return util.format("(%s:%s => %s) [%s]: %s", addr, port, ip, req.url, status);
            };

            paperboy.deliver(webroot, req, res)
                .addHeader('X-Powered-By', poweredby)
                .before(function() {
                    self.logDebug(serverReqMsg('request received'));
                })
                .after(function(statusCode) {
                    self.logInfo(serverReqMsg(httpmsg(statusCode)));
                })
                .error(function(statusCode, msg) {
                    self.logWarn(serverReqMsg(httperrorf(statusCode,req.url)));
                    self.logDebug(msg);
                    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
                    res.end(httperror(statusCode));
                })
                .otherwise(function(err) {
                    var code = 404;
                    self.logWarn(serverReqMsg(httperrorf(code,req.url)));
                    self.logDebug(err);
                    res.writeHead(code, { 'Content-Type': 'text/plain' });
                    res.end(httperrorf(code,req.url));
                });
        }
    });

    _.extend(Webserver.prototype, {
        configure: function(eco, cfg){

            var
            serverCfg = cfg.get('server',{});
            poweredby = cfg.get('applicationName', poweredby);

            if(serverCfg.port) {
                port = serverCfg.port;
            }
            if(serverCfg.addr) {
                addr = serverCfg.addr;
            }
            if(serverCfg.webroot) {
                webroot = eco.getPathFromHome(serverCfg.webroot);
            }
        },
        isRunning: function() {
            return server !== null;
        },
        start: function(callback) {
            this.logInfo('server starting');
            this.logDebug('host:',util.format('%s:%s', addr, port));
            this.logDebug('webroot:',webroot);
            this.logDebug('poweredby:',poweredby);

            server = http.createServer( Webserver.PaperboyServer )
                         .listen(port, addr);

            util.callback(callback);
        },
        stop: function(callback) {
            this.logInfo('server is stopping');

            server = null;

            util.callback(callback);
        },
        restart: function(callback) {
            var
            self = this;

            if(self.isRunning()) {
                self.stop(function(){
                    self.start(callback);
                });
            }
            else { // only start
                self.start(callback);
            }
        }
    });

    module.exports = instance = new Webserver();
})(
require('util'),
require('events'),
require('underscore'),
require('http'),
require('paperboy')
);