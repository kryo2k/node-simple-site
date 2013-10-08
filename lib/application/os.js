(function(_){

    var
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

    // define constants first
    _.extend(exports,{

        // CPU checks
        isArm:  (arch === types.ARCH_ARM),
        isIa32: (arch === types.ARCH_IA32),
        isX64:  (arch === types.ARCH_X64),

        // OS checks
        isDarwin:  (platform === types.OS_DARWIN),
        isFreeBSD: (platform === types.OS_FREEBSD),
        isLinux:   (platform === types.OS_LINUX),
        isSunOS:   (platform === types.OS_SUNOS),
        isWin32:   (platform === types.OS_WIN32)
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

    // compute the os/cpu string only once.
    exports.platformString = exports.osString + '-' + exports.cpuString;

})(
    require('underscore')
);