(function(_){
    var
    DEBUG = 1,
    INFO  = 2,
    WARN  = 3,
    ERROR = 4,

    scope = console,
    level = DEBUG;

    function stringUnshift(args,str) {
        Array.prototype.unshift.call(args,str);
        return args;
    }
    function ts(msg){
        return (new Date()).getTime() + '|' + msg;
    }
    _.extend(exports,{
        DEBUG: DEBUG,
        INFO:  INFO,
        WARN:  WARN,
        ERROR: ERROR,

        stringUnshift: stringUnshift,

        configure: function(cfg){
            cfg = cfg || {};
            this.debug("Configuring logger:",cfg);
            if(cfg.level) {
                level = cfg.level;
            }
        },

        debug: function(){
            if(level > DEBUG) return;
            scope.log.apply(scope,   stringUnshift(arguments,ts('debug|')));
        },
        info: function(){
            if(level > INFO) return;
            scope.info.apply(scope,  stringUnshift(arguments,ts(' info|')));
        },
        warn: function(){
            if(level > WARN) return;
            scope.warn.apply(scope,  stringUnshift(arguments,ts(' warn|')));
        },
        error: function(){
            scope.error.apply(scope, stringUnshift(arguments,ts('error|')));
        }
    });
})(
    require('underscore')
);