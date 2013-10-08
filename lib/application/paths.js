(function(_,path){
    var
    homePath = path.resolve(__dirname + "/../../");

    _.extend(exports,{
        CONFIG: path.join(homePath,"cfg"),
        LIB:    path.join(homePath,"lib"),

        getRelativePathFromHome: function(filePath){
            return path.relative(homePath, filePath);
        },
        getPathFromHome: function(fileName){
            return path.join(homePath, fileName);
        },
        getPathConfigFile: function(fileName){
            return path.join(exports.CONFIG, fileName + '.json');
        }
    });
})(
    require('underscore'),
    require('path')
);