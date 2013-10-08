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
            getConfig: function(){
                return config;
            },
            getLog: function(){
                return log;
            },
            getServer: function(){
                return server;
            },
            startServer: function(){
                server.start();
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
        }
    });

})(
    require('underscore'),
    require('./application/config.js'),
    require('./application/log.js'),
    require('./application/server.js')
);