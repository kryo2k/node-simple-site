global.config = {
    defaultConfigFile: 'default'
};

(function(_, core) {
    core.boot(function(instance){
        var
        log = core.getLog(),
        config = core.getConfig().get('requireJs'),
        requirejs = core.getRequireJs(),
        logTag = 'requireJS optimize';

        log.debug(logTag,'running..');

        requirejs.optimize(config, function (buildResponse) {
            log.debug(logTag, buildResponse);
        }, function(err) {
            log.error(logTag, err.originalError);
        });
    });
})(
    require('underscore'),
    require('./lib/core')
);