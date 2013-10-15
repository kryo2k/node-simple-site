(function(util, _, cfg){
    var
    config = cfg.global,
    buffer = [],
    priority = {
        DEBUG: {code: 1, format: '[%s] debug | %s'},
        INFO:  {code: 2, format: '[%s]  info | %s'},
        WARN:  {code: 3, format: '[%s]  warn | %s'},
        ERROR: {code: 4, format: '[%s] error | %s'}
    };

    function _bufferItem(args, priority) {
        return {
            timestamp: new Date(),
            arguments: args,
            priority:  priority
        };
    }
    function _bufferPush(args, priority) {
        return buffer.push(_bufferItem(args, priority));
    }
    function _outputItem(item) {
        if(config.get('logPriority', 1) > item.priority.code) return;
        var
        msgArr = Array.prototype.slice.call(item.arguments),
        msgItems = [];

        while(msgArr.length > 0) {
            var
            itm = msgArr.shift(),
            norm = "";

            if(typeof itm === 'string') {
                norm = itm; 
            }
            else {
                norm = util.inspect(itm); 
            }

            msgItems.push(norm); 
        }

        util.puts(util.format(
            item.priority.format,
            item.timestamp.toISOString(),
            msgItems.join(' ')
        ));
    }
    function _outputBuffer() {
        if(!util.isArray(buffer) || buffer.length === 0) return;

        while(buffer.length > 0) {
            _outputItem(buffer.shift());
        }
    }
    function _log(args, priority){

        // buffer the logging output
        _bufferPush(args, priority);

        if(config.isReady()) { // only output when configured
            _outputBuffer();
        }
    }
    // creates a function that logs with the given priority
    function _logger(priority) {
        return function(){
            _log(arguments, priority);
        };
    }
    // creates a function that returns a function to log with the given priority
    function _createLogger(priority) {
        return function() {
            return _logger(priority);
        };
    }

    config.on('ready', function(config) {
        _outputBuffer();
    });

    _.extend(exports,{

        isDebugging: function(){
            return config.get('logPriority', 1) === 1;
        },

        createDebugFn: _createLogger(priority.DEBUG),
        createInfoFn:  _createLogger(priority.INFO),
        createWarnFn:  _createLogger(priority.WARN),
        createErrorFn: _createLogger(priority.ERROR),

        debug: _logger(priority.DEBUG),
        info:  _logger(priority.INFO),
        warn:  _logger(priority.WARN),
        error: _logger(priority.ERROR),
    });
})(
require('util'),
require('underscore'),
require('./config')
);