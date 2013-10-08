(function(_, log){
    _.extend(exports,{
        configure: function(cfg){
            cfg = cfg || {};
            log.debug("Configuring server:",cfg);
        },
        start: function(){
            log.debug("Starting server");
        },
        stop: function(){
            log.debug("Stopping server");
        }
    });
})(
    require('underscore'),
    require('./log.js')
);