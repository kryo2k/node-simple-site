(function(){

    requirejs.config({
        baseUrl: 'js/lib',
        paths: {
            jquery: 'jquery-2.0.3'
        }
    });

    requirejs(['nss/core'],function(core){
        console.log(core);
    });
})();