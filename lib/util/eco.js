(function(util, path, _){
    var
    homePath = path.resolve(__dirname + "/../../"),
    arch = process.arch,
    platform = process.platform,
    env = process.env,
    types = {

        // for cpu architecture
        ARCH_ARM:   'arm',
        ARCH_IA32:  'ia32',
        ARCH_X64:   'x64',

        // for platforms
        OS_DARWIN:  'darwin',
        OS_FREEBSD: 'freebsd',
        OS_LINUX:   'linux',
        OS_SUNOS:   'sunos',
        OS_WIN32:   'win32',
    };

    _.extend(exports,{

        // constants
        CONFIG: path.join(homePath,"cfg"),
        LIB:    path.join(homePath,"lib"),
        PUBLIC: path.join(homePath,"public"),

        // CPU checks
        isArm:  (arch === types.ARCH_ARM),
        isIa32: (arch === types.ARCH_IA32),
        isX64:  (arch === types.ARCH_X64),

        // OS checks
        isDarwin:  (platform === types.OS_DARWIN),
        isFreeBSD: (platform === types.OS_FREEBSD),
        isLinux:   (platform === types.OS_LINUX),
        isSunOS:   (platform === types.OS_SUNOS),
        isWin32:   (platform === types.OS_WIN32),

        // gets a file path relative to home
        getRelativePathFromHome: function(filePath) {
            return path.relative(homePath, filePath);
        },

        // gets an absolute file path from home
        getPathFromHome: function(fileName) {
            return path.join(homePath, fileName);
        },

        // gets an asbolute file path to a config file (appends .json)
        getPathConfigFile: function(fileName){
            return path.join(exports.CONFIG, fileName + '.json');
        },

        // gets an absolute file path to a component
        getPathComponent: function(componentName) {
            return path.join(exports.LIB, 'component', componentName + '.js');
        },

        // gets an absolute file path to file in public dir
        getPathPublic: function(fileName) {
            return fileName === undefined ? exports.PUBLIC : path.join(exports.PUBLIC, fileName);
        }
    });

    //
    exports.isLinuxLike = (exports.isLinux||exports.isFreeBSD||exports.isSunOS||exports.isDarwin);

    if( exports.isLinuxLike ) {
        exports.user = env['USER'];
    }

    // load the cpu string
    switch(true){
        case exports.isArm: {
            exports.cpuString = "ARM";
            break;
        }
        case exports.isIa32: {
            exports.cpuString = "IA32";
            break;
        }
        case exports.isX64: {
            exports.cpuString = "x64";
            break;
        }
        default: {
            exports.cpuString = "Unknown";
            break;
        }
    }

    // load the os string
    switch(true){
        case exports.isDarwin: {
            exports.osString = "Darwin";
            break;
        }
        case exports.isFreeBSD: {
            exports.osString = "FreeBSD";
            break;
        }
        case exports.isLinux: {
            exports.osString = "Linux";
            break;
        }
        case exports.isSunOS: {
            exports.osString = "SunOS";
            break;
        }
        case exports.isWin32: {
            exports.osString = "Windows";
            break;
        }
        default: {
            exports.osString = "Unknown";
            break;
        }
    }
})(
require('util'),
require('path'),
require('underscore')
);