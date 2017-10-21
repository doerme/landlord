setTimeout(function() {
    $('.js-loading-line').addClass('full');
}, 100);

/** 房间状态 */
var ROOMSTATE = 5; /**5.游戏初始化 1.叫地主阶段 3.游戏中 2.游戏结算 */
var DFAVATAR = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=807731740,1529657662&fm=111&gp=0.jpg';

var app = {
    curWebSocket: null,
    curUid: window.location.href.match(/uid=(\d+)/) ? window.location.href.match(/uid=(\d+)/)[1] : '1001',
    init: function(){
        var self = this;
        $('.js-loading-wrap').addClass('hide');
        $('.js-game-wrap').removeClass('hide');
        // 开始ws
        self.beginWS();
        self.bindEven();
    },
    showGameWrap: function(){
        var self = this;
    },
    // 位置坐下显示
    showSitDown: function(jdata){
        var self = this;
        if(jdata.uid == self.curUid){
            // 自己坐下
            $('.game-wrap-foot-avatar').attr({
                src: jdata.avatar
            });
            $('.game-wrap-foot-gold').html(jdata.score);
        }else{
            // 其他人坐下
            if($('.user-info-wrap.left').hasClass('joined')){
                $('.sit-down-bt.one').attr({
                    src: jdata.avatar
                }).removeClass('hide');
                //nickName score
                $('.user-info-wrap.left').find('.name').html(jdata.nickName);
                $('.user-info-wrap.left').find('.score').html(jdata.score);
                $('.user-info-wrap.left').removeClass('hide');
            }else{
                $('.sit-down-bt.two').attr({
                    src: jdata.avatar
                }).removeClass('hide');
                //nickName score
                $('.user-info-wrap.right').find('.name').html(jdata.nickName);
                $('.user-info-wrap.right').find('.score').html(jdata.score);
                $('.user-info-wrap.right').removeClass('hide');
            }
        }

    },
    bindEven: function(){
        var self = this;
        // sit-down-bt
        $('.sit-down-bt').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'jt',
                    uid: self.curUid,
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });

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

        // im输入框显示
        $('.game-wrap-foot-im2').on('click', function(){
            $('.js-im-wrap').removeClass('hide');
        });

        // im输入消失
        $('.im-wrap-mask').on('click', function(){
            $('.js-im-wrap').addClass('hide');
        });

        // im tab 切换
        $('.im-wrap-main-tab > li').on('click', function(){
            $('.im-wrap-main-tab > li.cur').removeClass('cur');
            $(this).addClass('cur');
        })

        // 录音按下
        $('.game-wrap-foot-im1').on('touchstart', function(){
            $('.ctrl-voice-mark').removeClass('hide');
        });
        // 录入结束
        $('.game-wrap-foot-im1').on('touchend', function(){
            $('.ctrl-voice-mark').addClass('hide');
        });
    },
    beginWS: function(){
        var self = this;
        var option = {
            url: 'ws://192.168.1.4:7272',
            callback: function(jdata){
                if(typeof(jdata) == 'string'){
                    jdata = JSON.parse(jdata);
                }
                console.log('ws cb', jdata);
                switch(jdata.type){
                    case 'jt':
                    self.showSitDown(jdata.player);
                    break;
                }
            }
        }
        self.initSocket(option);
    },
    initSocket: function(option) {
        var self = this;
        //服务器地址
        var locate = window.location;
        var url = option.url ? option.url : "ws://" + locate.hostname + ":" + locate.port + _get_basepath() + "/websocket";
        //回调函数
        var callback = option.callback;
        if (typeof callback !== "function") {
            console.log('callback 必须为函数');
            return false;
        }
        //一些对浏览器的兼容已经在插件里面完成
        self.curWebSocket = new ReconnectingWebSocket(url);
        //var websocket = new WebSocket(url);
    
        //连接发生错误的回调方法
        self.curWebSocket.onerror = function () {
            console.log("websocket.error");
            var param = {
                type: 'login',
                uid: self.curUid,
                tid: 2010, /**  房间id*/
                score: 200,
                uids: [1001,1002,1003],
                isReConn: 1,
                name: self.curUid,
                avatar: DFAVATAR,
            }
            self.curWebSocket.send(JSON.stringify(param));
        };
    
        //连接成功建立的回调方法
        self.curWebSocket.onopen = function (event) {
            console.log("onopen");
            var param = {
                type: 'login',
                uid: self.curUid,
                tid: 2010, /**  房间id*/
                score: 200,
                uids: [1001,1002,1003],
                isReConn: 0,
                name: self.curUid,
                avatar: DFAVATAR,
            }
            self.curWebSocket.send(JSON.stringify(param));
        }
    
        //接收到消息的回调方法
        self.curWebSocket.onmessage = function (event) {
            callback(event.data);
        }
    
        //连接关闭的回调方法
        self.curWebSocket.onclose = function () {
            self.curWebSocket.close();
            console.log("websocket.onclose");
        }
    
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
            self.curWebSocket.close();
        }
        return self.curWebSocket;
    }
}

window.onload = function(){
    setTimeout(()=>{
        app.init();
    },800)
}