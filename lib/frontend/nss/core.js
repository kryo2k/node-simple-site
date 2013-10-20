define([
  'jquery',
  'nss/log'
], function($,log){

    function Core() {
        $.extend(this,{
            log: log
        });
    }

    console.log('nss/core module loaded..');

    return new Core();
});