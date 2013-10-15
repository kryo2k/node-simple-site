(function(util, events, _, log, eco, cfg){

    _.extend(util,{
        callback: function(){
            var
            args = Array.prototype.slice.call(arguments),
            fn   = args.shift();

            if(_.isFunction(fn)) {
                fn.apply(fn, args);
            }
        },
        formatDuration: function(elapsed){
            return util.format('%d sec',(elapsed / 1000));
        },
        formatBenchmark: function(start,end){
            return this.formatDuration((end||new Date()).getTime() - start.getTime());
        },
        // array manipulation functions
        // @see http://stackoverflow.com/questions/1348178/a-better-way-to-splice-an-array-into-an-array-in-javascript
        insertAt: function(array, index) {
            var arrayToInsert = Array.prototype.splice.apply(arguments, [2]);
            return util.insertArrayAt(array, index, arrayToInsert);
        },
        insertArrayAt: function(array, index, arrayToInsert) {
            Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
            return array;
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
                isDebugging: log.isDebugging,
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
        debugging = log.isDebugging(),
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

            if( debugging ) log.debug(bootMsg(clName,'booting..'));

            clRoot.on(clEvent,function(){
                if( debugging ) log.debug(bootMsg(clName,'ready.'));

                checkCount++;

                if( checkCount === checklist.length) {
                    if( debugging ) log.debug('system ready');
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
        shutdown: function(callback){
            if( this.isDebugging() ) log.debug("shutting down");
            util.callback(callback);
        },
        get: getComponent,

        isDebugging: log.isDebugging,

        debug: log.createDebugFn(),
        info:  log.createInfoFn(),
        warn:  log.createWarnFn(),
        error: log.createErrorFn(),

        getLog: function() {
            return log;
        },
        getEcoSystem: function() {
            return eco;
        },
        getConfig: function() {
            return config;
        }
    });
})(
require('util'),
require('events'),
require('underscore'),
require('./util/log'),
require('./util/eco'),
require('./util/config')
);