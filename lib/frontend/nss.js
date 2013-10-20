(function(){

    requirejs.config({
        baseUrl: 'js/lib',
        paths: {
            jquery: 'jquery-2.0.3',
            nss: 'nss'
        }
    });

    requirejs(['nss/core'],function(main){
        console.log(main);
    });
})();