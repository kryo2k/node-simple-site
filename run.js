global.config = {
    defaultConfigFile: 'default'
};

(function(core) {
    core.boot(function(instance){
        core.get('webserver').start();
    });
})(require('./lib/core'));