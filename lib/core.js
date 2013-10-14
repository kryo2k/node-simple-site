(function(util, events, _, log, eco, cfg){

    _.extend(util,{
        callback: function(){
            var
            args = Array.prototype.slice.call(arguments),
            fn   = args.shift();

            if(_.isFunction(fn)) {
                fn.apply(fn, args);
            }
        }
    });

    var
    checklist = [
        { name: 'configuration', root: cfg.global, event: 'ready' }
    ];

    function Core() {
        events.EventEmitter.call(this);
        return this;
    }

    // inherit constructor from event emitter.
    util.inherits(Core, events.EventEmitter);

    var
    instance = module.exports = new Core(),
    config = cfg.global,
    onReady = function(){
        instance.emit('ready', instance);
    },
    onError = function(msg){
        instance.emit('error', instance, msg);
    },
    getComponent = function(name){
        var
        comp = require(eco.getPathComponent(name)),
        bootSig = '$__booted$$';

        if(comp[bootSig] === undefined) {

            // on the fly extension of components
            _.extend(comp,{
                log: log,
                logDebug: log.debug,
                logInfo: log.info,
                logWarn: log.warn,
                logError: log.error
            });

            if(_.isFunction(comp.configure)) {
                comp.configure(eco, config);
            }

            comp[bootSig] = true;
        }

        return comp;
    },
    runChecklist = function(callback){

        var
        checkCount = 0,
        bootMsg = function(clItem, status) {
            return util.format("checklist item '%s' %s", clItem, status);
        };

        if(checklist.length === 0) { // nothing to wait for
            util.callback(callback);
            return;
        }

        _.each(checklist, function(v, i){
            var
            clName = v.name,
            clRoot = v.root,
            clEvent = v.event||'ready';

            log.debug(bootMsg(clName,'booting..'));

            clRoot.on(clEvent,function(){
                checkCount++;
                log.debug(bootMsg(clName,'ready.'));

                if( checkCount === checklist.length) {
                    log.debug('system ready');
                    util.callback(callback);
                }
            });
        });
    };

    _.extend(Core.prototype, {
        boot: function(callback){
            runChecklist(function(){
                onReady();
                util.callback(callback);
            });
        },
        get: getComponent
    });
})(
require('util'),
require('events'),
require('underscore'),
require('./util/log'),
require('./util/eco'),
require('./util/config')
);