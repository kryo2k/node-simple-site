global.config = {
    defaultConfigFile: 'default'
};

(function(core) {
    core.boot(function(instance){
        core.get('webserver').start(function(){
        });
    });
    process.on('SIGINT', function() {
        core.debug('Got SIGINT. Exiting process.');
        process.exit();
    });
    process.on('exit', function(){
        core.get('webserver').stop(function(){
            core.shutdown(function(){
                core.debug("good bye!");
            });
        });
    });
})(require('./lib/core'));