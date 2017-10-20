setTimeout(function() {
    $('.js-loading-line').addClass('full');
}, 100);

var app = {
    init: function(){
        var self = this;
        $('.js-loading-wrap').addClass('hide');
        $('.js-game-wrap').removeClass('hide');
        self.bindEven();
    },
    showGameWrap: function(){
        var self = this;
    },
    bindEven: function(){
        var self = this;
        // 更多菜单弹出
        $('.js-bt-more').on('click', function(){
            $('.js-more-menu').removeClass('hide');
        });
        // 更多菜单收起
        $('.js-more-menu .more-menu-mask').on('click', function(){
            $('.js-more-menu').addClass('hide');
        });
    }
}

window.onload = function(){
    setTimeout(()=>{
        app.init();
    },800)
}