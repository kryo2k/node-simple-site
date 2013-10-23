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
    port = 8080,
    addr = '0.0.0.0',
    routes = null,
    app = express(),
    appServer = null;

    _.extend(ExpressApp.prototype, {
        configure: function(eco, cfg){

            var
            expressCfg = cfg.get("expressApp"),
            poweredby = cfg.get('applicationName', 'Smartphone');

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

            app.set('env', environment);
            me.logDebug(tag, 'set environment:',environment);

            app.get('/', function(req, res){
                res.send("Hello world");
            });
        },
        clearRoutes: function(){
            me.logDebug(tag, 'clearing all previous routes');
            // TODO: ..
        },
        installRoutes: function(clear){
            if(clear) {
                this.clearRoutes();
            }
            if(routes === null) {
                me.logWarn(tag, 'no routes in configuration.');
                return;
            }

            if(routes.static !== undefined) {
                me.logDebug(tag, 'installing static routes..');
            }

            // TODO: ..

            me.logDebug(tag, 'routes installed.');
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

            //app.use(express.static(path.))
            this.installRoutes(true);

            appServer = app.listen(app.get('port'), app.get('addr'));

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