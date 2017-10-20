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
        // 右侧菜单出现
        $('.js-bt-detail').on('click', function(){
            $('.js-ctrlright-view-wrap').removeClass('hide');
        });
        // 右侧菜单收起
        $('.ctrlright-view-mask').on('click', function(){
            $('.js-ctrlright-view-wrap').addClass('hide');
        });
        // 录音按下
        $('.game-wrap-foot-im1').on('touchstart', function(){
            $('.ctrl-voice-mark').removeClass('hide');
        });
        // 录入结束
        $('.game-wrap-foot-im1').on('touchend', function(){
            $('.ctrl-voice-mark').addClass('hide');
        });
    }
}

window.onload = function(){
    setTimeout(()=>{
        app.init();
    },800)
}