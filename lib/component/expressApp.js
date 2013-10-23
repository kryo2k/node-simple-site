(function(util, events, _, express){

    var
    me = null,
    tag = "expressApp";

    function ExpressApp() {
        events.EventEmitter.call(this);
        return this;
    }

    util.inherits(ExpressApp, events.EventEmitter);

    var
    routes = null,
    app = express(),
    appServer = null;

    function _clearRoutes(){
        me.logDebug(tag, 'clearing all previous routes');
    }
    function _installRoutes(clear){
        if(clear) {
            _clearRoutes();
        }
        if(routes === null) {
            me.logError(tag, 'no routes in configuration.');
            return;
        }

        var
        _static = routes.static,
        _dynamic = routes.dynamic;

        if(_static !== undefined) {
            me.logDebug(tag, 'installing static routes..');
            _.each(_static, function(k, v){
//              app.use(express.static(eco.getPathPublic()));

                me.logDebug(tag, 'static route:', v);
            });
        }
        else me.logWarn(tag, 'no static routes defined.');

        if(_dynamic !== undefined) {
            me.logDebug(tag, 'installing dynamic routes..');
            _.each(_dynamic, function(v,k){

/*          app.get('/', function(req, res){
                res.send("Hello world");
            });*/

                me.logDebug(tag, 'dynamic route:', v);
            });
        }
        else me.logWarn(tag, 'no dynamic routes defined.');

        me.logDebug(tag, 'routes installed.');
    }
    
    _.extend(ExpressApp.prototype, {
        configure: function(eco, cfg){

            var
            expressCfg = cfg.get("expressApp");

            function appConfigureEnvironment(env) {
                var envConfig = expressCfg.environments[env];
                if(envConfig === undefined) {
                    return function(){
                        me.logWarn(tag, "no special configuration provided for environment:", env);
                    };
                }

                return function() {
                    _.each(envConfig, function(v,k){
                        me.logDebug(tag, util.format("set env (%s) variable (%s) to %s", env, k, util.inspect(v) ));
                        app.set(k, v);
                    });
                };
            }

            if(expressCfg.environment) {
                environment = expressCfg.environment;
            }
            if(expressCfg.routes) {
                routes = expressCfg.routes;
            }

            // global configs
            app.configure(appConfigureEnvironment('common'));

            // development configs
            app.configure('development', appConfigureEnvironment('development'));

            // production configs
            app.configure('production', appConfigureEnvironment('production'));

            app.set('poweredBy', cfg.get('applicationName', 'Smartphone'));

            app.set('env', environment);
            me.logDebug(tag, 'set environment:',environment);

            // temporary
            app.use(express.static(eco.getPathPublic()));
        },
        start: function(callback){

            function __callback() {
                if(_.isFunction(callback)) callback.call(callback, app, appServer);
            }

            me.logInfo(tag, 'starting..');

            if(appServer !== null) {
                me.logWarn(tag, 'server is already running.');
                return __callback();
            }

            var port = app.get('port'), addr = app.get('addr');

            _installRoutes(true);

            appServer = app.listen(port, addr);
            me.logInfo(tag, util.format("server listening on %s:%d",addr,port));

            return __callback();
        },
        stop: function(callback){
            me.logInfo(tag, 'stopping..');
        },
        restart: function(callback){
            me.logInfo(tag, 'restarting..');
        }
    });

    module.exports = me = new ExpressApp();
})(
require('util'),
require('events'),
require('underscore'),
require('express')
);