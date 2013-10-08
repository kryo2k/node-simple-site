(function(_, config, log, server){

    var
    Instance = null,
    Application = function(cfg){

        _.extend(this,{
            configure: function(config){
                log.debug("Configuring with:",config);

                // configure sub-components
                this.getLog().configure(config.log);
                this.getServer().configure(config.server);
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
                this.getServer().start();
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

    /*
    Application.Server = function(){

        var http = require('http');

        http.createServer(function (req, res) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('Hello World\n');
        }).listen(1337, '127.0.0.1');

        console.log('Server running at http://127.0.0.1:1337/');

        return http;
    };
    */
})(
    require('underscore'),
    require('./application/config.js'),
    require('./application/log.js'),
    require('./application/server.js')
);