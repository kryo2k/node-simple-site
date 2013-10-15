(function(util, events, fs, _, log, eco) {
    function Config(defaults) {
        events.EventEmitter.call(this);

        var
        self = this,
        ready = false,
        cfgdata = defaults||{},
        onReady = function() {
            ready = true;
            self.emit('ready',cfgdata);
        },
        onFileError = function(file,err){
            self.emit('readfileerror',file,err);
        },
        _extend = function(cfg) {
            return _.extend(cfgdata, cfg||{});
        },
        _get = function(key, def){
            if(cfgdata[key] === undefined) return def;
            return cfgdata[key];
        },
        _isReady = function(){
            return ready;
        },
        _openFile = function(f, callback) {
            callback = callback||function(){};

            var
            fRel = eco.getRelativePathFromHome(f),
            fMsg = function(msg) {
                return util.format("Config file '%s' %s", fRel, msg);
            };

            fs.exists(f, function(exists){
                var
                success = false,
                fileData = null;

                if(exists) {
                    fs.readFile(f, function(err, data){
                        if(err) {
                            onFileError(f, err);
                            return;
                        }

                        if(data.length > 0) {
                            var json = JSON.parse(data);
                            if(typeof json === 'object') {
                                log.info(fMsg("loaded."));
                                fileData = json;
                                success = true;
                            }
                            else log.warn(fMsg("did not contain a JSON object."));
                        }
                        else log.warn(fMsg("did not contain any data."));

                        // finally call the callback when complete loading
                        callback(success,fileData);
                    });
                }
                else {
                    log.debug(fMsg('does not exist.'));
                    callback(success,fileData);
                }
            });
        };

        // initialize the configuration from json files
        _openFile(eco.getPathConfigFile(_get('defaultConfigFile',"default")), function(success,defcfg){

            if(!success) throw "Could not load default configuration";

            // update config with defaults (loaded from file)
            _extend(defcfg);

            if(_get('loadUserConfigFile',true)) {
                if(eco.isLinuxLike && eco.user) {
                    _openFile(eco.getPathConfigFile(eco.user), function(success,usrcfg){

                        if(success) { // update config with defaults (loaded from file)
                            _extend(usrcfg);
                        }

                        onReady();
                    });
                }
                else {
                    log.warn("OS is not linux or doesn't support process.getuid(), skipping user config file and using default configuration file.");
                    onReady();
                }
            }
            else {
                onReady();
            }
        });

        return _.extend(self, {
            extend: _extend,
            get: _get,
            isReady: _isReady
        });
    }

    // inherit constructor from event emitter.
    util.inherits(Config, events.EventEmitter);

    _.extend(exports, {
        Config: Config,
        global: new Config(global.config || {})
    });
})(
require('util'),
require('events'),
require('fs'),
require('underscore'),
require('./log'),
require('./eco')
);