(function(_, config, log, server){

    var
    Instance = null,
    Application = function(cfg){

        _.extend(this,{
            configure: function(config){
                log.debug("Configuring with:",config);

                // configure sub-components
                log.configure(config.log);
                server.configure(config.server);
            },
            shutdown: function(){
                log.debug('Shutting down server');
                this.stopServer();
            },
            startServer: function(){
                return server.start();
            },
            stopServer: function(){
                server.stop();
            }
        });

        // configure the sub-components of this application
        this.configure(cfg);

        return this;
    };

    _.extend(exports,{
        bootstrap: function(cfg){
            if( Instance !== null ) {
                return Instance;
            }

            return Instance = new Application(config.loadCfg(cfg));
        },
        getInstance: function(){
            if(Instance === null) {
                throw "Application has not been booted.";
            }

            return Instance;
        },
        getConfig: function(){
            return config;
        },
        getLog: function(){
            return log;
        },
        getServer: function(){
            return server;
        }
    });

})(
    require('underscore'),
    require('./application/config.js'),
    require('./application/log.js'),
    require('./application/server.js')
);