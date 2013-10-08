(function(_, fs, log, os, paths){

    log.debug("OS detected:", os.platformString);

    function fsConfigLoadSync(f, config){
        config = config || {};

        var
        fRel = paths.getRelativePathFromHome(f),
        fMsg = function(msg) {
            return "Config file '" + fRel + "' " + msg;
        };

        if( ! fs.existsSync(f) ) {
            log.error(fMsg("does not exist"));
            return config;
        }

        try {
            var data = fs.readFileSync(f);
            if(data.length > 0) {
                var json = JSON.parse(data);
                if(typeof json === 'object') {
                    _.extend(config, json);
                    log.debug(fMsg("loaded successfully"));
                }
                else log.warn(fMsg("did not contain a JSON object"));
            }
            else log.warn(fMsg("did not contain any data"));
        }
        catch(err) {
            log.warn(fMsg('there has been an error parsing JSON config file.'));
            log.warn(err);
        }

        return config;
    }

    _.extend(exports,{

        loadCfgFromUserFile: function(config){

            if(os.isLinuxLike && os.user) {

                var
                uCFAbsolute = paths.getPathConfigFile(os.user),
                uCFRelative = paths.getRelativePathFromHome(uCFAbsolute);

                if(fs.existsSync(uCFAbsolute)) {
                    log.info("User config file '"+ uCFRelative + "' exists, loading..");
                    _.extend(config, fsConfigLoadSync(uCFAbsolute));
                }
                else log.debug("User config file '"+ uCFRelative + "' not found, skipping..");
            }
            else log.warn("OS is not linux or doesn't support process.getuid(), skipping user config file and using default configuration file.");

            return config;
        },

        loadCfg: function(defaults){
            return this.loadCfgFromUserFile( fsConfigLoadSync(paths.getPathConfigFile('default'), defaults) );
        }
    });
})(
    require('underscore'),
    require('fs'),
    require('./log.js'),
    require('./os.js'),
    require('./paths.js')
);