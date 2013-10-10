(function(app){
    var
    instance = app.bootstrap(),
    log = app.getLog();

    instance.startServer();

    process.on('SIGINT', function() {
        log.debug('Got SIGINT. Exiting process.');
        process.exit();
    });
    process.on('exit', function(){
        log.debug("Application exiting");
        instance.shutdown();
    });
})(
    require("./lib/application.js")
);
