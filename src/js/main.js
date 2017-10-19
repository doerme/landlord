setTimeout(function() {
    $('.js-loading-line').addClass('full');
}, 100);

var app = {
    init: function(){
        $('.js-loading-wrap').addClass('hide');
        $('.js-game-wrap').removeClass('hide');
    },
    showGameWrap: function(){

    }
}

window.onload = function(){
    setTimeout(()=>{
        app.init();
    },800)
}