(function(_,_s){
    var
    DEBUG = 0,
    INFO  = 1,
    WARN  = 2,
    ERROR = 3,

    scope = console,
    level = DEBUG,
    configured = false,
    buffer = [];

    function stringUnshift(args,str){
        Array.prototype.unshift.call(args,str);
        return args;
    }
    function ts(msg){
        return (new Date()).getTime() + '|' + msg;
    }
    function priorityCallback(priority){
        switch(priority) {
        case DEBUG: return scope.log;
        case INFO:  return scope.info;
        case WARN:  return scope.warn;
        case ERROR: return scope.error;
        default: throw _s.sprintf("Invalid log priority: %s", priority);
        }
    }
    function log(priority, args){

        if(configured == false){ // queue this log message
            buffer.push([priority,args]);
            return;
        }

        var
        desc = ['debug','info','warn','error'],
        format = ts("%5s|"),
        prefix = _s.sprintf(format, desc[priority]||ERROR),
        callback = priorityCallback(priority);

        if(level > priority) return;
        callback.apply(scope, stringUnshift(args,prefix));
    }

    _.extend(exports,{

        stringUnshift: stringUnshift,

        configure: function(cfg){
            cfg = cfg || {};
            this.debug("Configuring logger:",cfg);
            if(cfg.level) {
                level = cfg.level;
            }

            configured = true;

            if(buffer.length > 0) { // process any pre-configuration log entries
                _.each(buffer,function(v){
                    log(v[0],v[1]);
                });
                buffer = [];
            }
        },

        debug: function(){
            log(DEBUG,arguments);
        },
        info: function(){
            log(INFO,arguments);
        },
        warn: function(){
            log(WARN,arguments);
        },
        error: function(){
            log(ERROR,arguments);
        }
    });
})(
    require('underscore'),
    require('underscore.string')
);