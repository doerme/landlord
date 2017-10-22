import POCKETARR from './lib/pocket.js';
import UTIL from './lib/util.js';
setTimeout(function() {
    $('.js-loading-line').addClass('full');
}, 100);

/** 房间状态 */
var ROOMSTATE = 5; /**5.游戏初始化 1.叫地主阶段 3.游戏中 2.游戏结算 */
var DFAVATAR = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=807731740,1529657662&fm=111&gp=0.jpg';
var PAGETPL = {
    mainpocketwrap: require('./tpl/mainpocketwrap.tpl'),
    pocketwrap: require('./tpl/pocketwrap.tpl')
}

var app = {
    hasInterval: 1, // 心跳状态
    playInterVal: null, // 玩家定时器
    timeoutInterval: null, // 倒计时显示定时器
    timeoutIntervalVal: 0, // 倒计时显示器显示值
    curWebSocket: null, 
    curUid: window.location.href.match(/uid=(\d+)/) ? window.location.href.match(/uid=(\d+)/)[1] : '1001',
    curRoomId: window.location.href.match(/roomid=(\d+)/) ? window.location.href.match(/roomid=(\d+)/)[1] : '1001',
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
    // state 3坐下  8站起
    showSitDown: function(jdata, state){
        var self = this;
        if(jdata.uid == self.curUid){
            if(state == 8){
            // 自己离开
                $('.game-wrap-foot-avatar').attr({
                    src: '../img/page/head_eg.png'
                });
                $('.game-wrap-foot-gold').html(0);
            }
            if(state == 3){
            // 自己坐下
                $('.game-wrap-foot-avatar').attr({
                    src: jdata.avatar
                });
                $('.game-wrap-foot-gold').html(jdata.score);
            }
        }else{
            // 其他人坐下 or 离开
            if(!$('.user-info-wrap.left').attr('uid') || $('.user-info-wrap.left').attr('uid') == jdata.uid){
                if(state == 8){
                    $('.user-info-wrap.left').removeAttr('uid');
                    $('.sit-down-bt.one').addClass('hide');
                    $('.user-info-wrap.left').addClass('hide');
                }else{
                    $('.user-info-wrap.left').attr({
                        uid: jdata.uid
                    });
                    $('.sit-down-bt.one').attr({
                        src: jdata.avatar
                    }).removeClass('hide');
                    //name score
                    $('.user-info-wrap.left').find('.name').html(jdata.name);
                    $('.user-info-wrap.left').find('.score').html(jdata.score);
                    $('.user-info-wrap.left').removeClass('hide');
                }
            }else if(!$('.user-info-wrap.right').attr('uid') || $('.user-info-wrap.right').attr('uid') == jdata.uid){
                if(state == 8){
                    $('.user-info-wrap.right').removeAttr('uid');
                    $('.sit-down-bt.two').addClass('hide');
                    $('.user-info-wrap.right').addClass('hide');
                }else{
                    $('.user-info-wrap.right').attr({
                        uid: jdata.uid
                    });
                    $('.sit-down-bt.two').attr({
                        src: jdata.avatar
                    }).removeClass('hide');
                    //name score
                    $('.user-info-wrap.right').find('.name').html(jdata.name);
                    $('.user-info-wrap.right').find('.score').html(jdata.score);
                    $('.user-info-wrap.right').removeClass('hide');
                }
            }else{
                console.log('not uid match', jdata.uid);
            }
        }
    },
    // 用户展示
    showPlayInfos: function(jdata){
        var self = this;
        // 用户信息区
        for(var n in jdata){
            self.showSitDown(jdata[n], 3);
        }
    },
    // 游戏可以开始显示
    showCanBegin: function(jdata){
        var self = this;
        // 自己牌区
        $('.main-pocket-wrap').html(PAGETPL.mainpocketwrap({
            cardarr: jdata.selfCardNos,
            carddata: POCKETARR.pocketArr
        }))
        // 对方牌区
        for(var n in jdata.cardNums){
            if($(`.user-info-wrap[uid="${n}"]`).hasClass('left')){
                $('.pocket-num.left').html(jdata.cardNums[n]).removeClass('hide');
            }else if($(`.user-info-wrap[uid="${n}"]`).hasClass('right')){
                $('.pocket-num.right').html(jdata.cardNums[n]).removeClass('hide');
            }
        }
        // 地主牌堆
        $('.top-pocket-wrap').html(PAGETPL.pocketwrap({
            cardarr: jdata.threeCards,
            carddata: POCKETARR.pocketArr
        }))
        jdata.threeCards
        
        if(jdata.tableSt == 1){
            // 叫地主阶段
            self.showCtrlJiaoDiZhu(jdata);
        }else if(jdata.tableSt == 2){
            
            if(jdata.currOpUid){
                self.showChuPaiView(jdata);
            }else{
                // 游戏中第一轮
                self.makeUpDiZhu(jdata);
            }
        }else if(jdata.tableSt == 3){
            // 游戏结束
        }
        if(!self.playInterVal){
            self.playInterVal = setInterval(function(){
                self.getWSInterval();
            }, 1000);
        }
        
        $('.js-game-playingui').removeClass('hide');
        $('.js-game-waittingui').addClass('hide');
    },
    // 叫地主显示
    showCtrlJiaoDiZhu: function(jdata){
        var self = this;
        self.showTimeoutClock(jdata ? jdata.currOpUid : '', 20);
        if(jdata && jdata.currOpUid == self.curUid){
            self.showGameBt(1);
        }else{
            self.showGameBt();
        }
        $('.jiaodizhu-tips').addClass('hide');
        if(jdata && jdata.lUid == self.curUid){
            $('.jiaodizhu-tips.mine').removeClass('hide');
        }else if(jdata){
            if($(`.user-info-wrap[uid="${jdata.lUid}"]`).hasClass('left')){
                $('.jiaodizhu-tips.left').removeClass('hide');
            }else if($(`.user-info-wrap[uid="${jdata.lUid}"]`).hasClass('right')){
                $('.jiaodizhu-tips.right').removeClass('hide');
            }
        }
    },
    //  显示倒计时
    showTimeoutClock: function(opuid, timeoutval){
        var self = this;
        console.log('showTimeoutClock', opuid, self.curUid);
        $('.timeout-clock').addClass('hide');
        $('.user-timeout-clock').addClass('hide');
        if(opuid == self.curUid){
            $('.timeout-clock').removeClass('hide');
        }else{
            if($(`.user-info-wrap[uid="${opuid}"]`).hasClass('left')){
                $('.user-timeout-clock.left').removeClass('hide');
            }else if($(`.user-info-wrap[uid="${opuid}"]`).hasClass('right')){
                $('.user-timeout-clock.right').removeClass('hide');
            }
        }
        self.timeoutIntervalVal = timeoutval;
        clearInterval(self.timeoutInterval);
        self.timeoutInterval = setInterval(function(){
            if(self.timeoutIntervalVal > 0){
                self.timeoutIntervalVal--;
                $('.timeout-clock').html(self.timeoutIntervalVal);
                $('.user-timeout-clock').html(self.timeoutIntervalVal);
            }else{
                clearInterval(self.timeoutInterval);
            }
        },1000);
    },
    // 主区域控制按钮
    showGameBt: function(state){
        var self = this;
        $('.js-mybt').addClass('hide');
        if(state == 1){
            $('.bt-jiaodizhu,.bt-bujiaodizhu').removeClass('hide');
        }
    },
    // 确定地主
    makeUpDiZhu: function(jdata){
        var self = this;
        $('.top-pocket-wrap').removeClass('hide');
        self.showCtrlJiaoDiZhu();
        // 插入地主牌
        if(jdata.lUid == self.curUid){
            $('.main-pocket-wrap-bottom').append($('.top-pocket-wrap').html());
            $('.main-pocket-wrap').html(PAGETPL.mainpocketwrap({
                cardarr: UTIL.deskRebuild(false),
                carddata: POCKETARR.pocketArr
            }))
        }

        self.showChuPaiCtrl(jdata.lUid);
        self.showTimeoutClock(jdata ? jdata.lUid : '', 20);
    },
    // 出牌展示
    showChuPaiView: function(jdata){
        var self = this;
        console.log('showChuPaiView', jdata);
        if(jdata.lastCardNos){
            $('.js-chupaiqu-wrap').html(PAGETPL.pocketwrap({
                cardarr: jdata.lastCardNos,
                carddata: POCKETARR.pocketArr
            })).removeClass('hide');
        }

        if(jdata.lastPlayCardUid == self.curUid){

            $('.main-pocket-wrap').html(PAGETPL.mainpocketwrap({
                cardarr: UTIL.deskRebuild(true),
                carddata: POCKETARR.pocketArr
            }))
        }

        if(jdata.lastOpCardNum){
            if($(`.user-info-wrap[uid="${jdata.lastOpUid}"]`).hasClass('left')){
                $('.pocket-num.left').html(jdata.lastOpCardNum).removeClass('hide');
            }else if($(`.user-info-wrap[uid="${jdata.lastOpUid}"]`).hasClass('right')){
                $('.pocket-num.right').html(jdata.lastOpCardNum).removeClass('hide');
            }
        }

        self.showChuPai({
            uid: jdata.currOpUid
        });

        // 特效展示
        if(jdata.isBomb){
            $('.texiao-zhadan').removeClass('hide');
            setTimeout(function(){
                $('.texiao-zhadan').addClass('hide');
            }, 2000);
        }
        if(jdata.isSpring){
            $('.texiao-spring').removeClass('hide');
            setTimeout(function(){
                $('.texiao-spring').addClass('hide');
            }, 2000);
        }
    },
    // 出牌轮换
    showChuPai: function(jdata){
        var self = this;
        self.showChuPaiCtrl(jdata.uid);
        self.showTimeoutClock(jdata ? jdata.uid : '', 20);
    },
    // 当前出牌UI展示
    showChuPaiCtrl: function(playuid){
        var self = this;
        $('.js-mybt').addClass('hide');
        if(playuid == self.curUid){
            $('.bt-chupai,.bt-buchu').removeClass('hide');
        }
    },
    bindEven: function(){
        var self = this;
        // 坐下
        $('.sit-down-bt').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'jt',
                    uid: self.curUid,
                    op: '1',
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });

        // 离开 站起来
        $('.js-quit-desk,.js-stand-desk').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'jt',
                    uid: self.curUid,
                    op: '0'
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        })

        // 叫地主
        $('.bt-jiaodizhu').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'll',
                    uid: self.curUid,
                    op: 1,
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });
        // 不叫地主
        $('.bt-bujiaodizhu').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'll',
                    uid: self.curUid,
                    op: 0,
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });
        // 选牌
        $('.main-pocket-wrap').on('click', '.pok', function(){
            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
            }else{
                $(this).addClass('selected');
            }
        });
        // 出牌
        $('.bt-chupai').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'play',
                    uid: self.curUid,
                    playCardNos: UTIL.getChuPai(),
                    op: 1,
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });
        // 不出牌
        $('.bt-buchu').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'play',
                    uid: self.curUid,
                    playCardNos: [],
                    op: 1,
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });
        // 获奖弹窗关闭
        $('.game-result-mask').on('click', function(){
            $('.game-result-wrap').addClass('hide');
        })
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

        // 设置弹窗
        $('.js-setting').on('click', function(){
            
        })

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
            var tabIndex = $(this).index();
            $('.im-wrap-main-tab > li.cur').removeClass('cur');
            $(this).addClass('cur');
            $('.im-wrap-main-msg > .tab-content').addClass('hide');
            $('.im-wrap-main-msg > .tab-content').eq(tabIndex).removeClass('hide')
        })

        // 录音按下
        $('.game-wrap-foot-im1').on('touchstart', function(){
            $('.ctrl-voice-mark').removeClass('hide');
        });
        // 录入结束
        $('.game-wrap-foot-im1').on('touchend', function(){
            $('.ctrl-voice-mark').addClass('hide');
        });

        // im 表情发送
        $('.js-emjoy-wrap > li').on('click', function(){
            var emjoyId = $(this).index();
            if(self.curWebSocket){
                var param = {
                    type: 'chat',
                    uid: self.curUid,
                    ct: 2,
                    msg: emjoyId,
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });

        // im 聊天发送
        $('.js-talk-wrap > li').on('click', function(){
            var talkMsg = $(this).html();
            if(self.curWebSocket){
                var param = {
                    type: 'chat',
                    uid: self.curUid,
                    ct: 1,
                    msg: talkMsg,
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
        });
    },
    beginWS: function(){
        var self = this;
        var option = {
            // url: 'ws://120.26.207.102:7272',
            url: 'ws://192.168.1.4:7272',
            callback: function(jdata){
                if(typeof(jdata) == 'string'){
                    jdata = JSON.parse(jdata);
                }
                console.log('ws cb', jdata);
                if(jdata.type == 'test' && jdata.uid == '-1'){
                    self.hasInterval = 0;
                }
                if(jdata.type == 'll'){
                    // jdata.st 
                    /*
                    1	重置牌局
                    2	下一个叫地主
                    3	确定地主
                    4	重新匹配
                    */
                    if(jdata.st == 2){
                        // 选地主操作
                        self.showCtrlJiaoDiZhu(jdata);
                    }else if(jdata.st == 3){
                        // 确定地主
                        self.makeUpDiZhu(jdata);
                    }
                }
                if(jdata.type == 'play'){
                    if(jdata.s == 7){
                        UTIL.windowToast('非法出牌');
                    }else if(jdata.s == 1){
                        self.showChuPaiView(jdata);
                    }
                }

                // 登录成功
                if(jdata.type == 'login' && jdata.s == 1){

                }

                // 等待人齐阶段
                if(jdata.type == 'jt'){
                    if(jdata.playerInfos){
                        // 直接渲染房间人数
                        for(var n in jdata.playerInfos){
                            self.showSitDown(jdata.playerInfos[n], 3);
                        }
                    }else if(jdata.player){
                        // 显示人 加入 or 离开
                        self.showSitDown(jdata.player, jdata.s);
                    }
                }

                if(jdata.playerInfos){
                    // 显示当前用户
                    self.showPlayInfos(jdata.playerInfos);
                }
                
                if(jdata.tableInfo){
                    // 显示牌局
                    self.showCanBegin(jdata.tableInfo);
                }
            }
        }
        self.initSocket(option);
    },
    getWSInterval: function(){
        var self = this;
        var param = {
            type: 'test',
            uid: self.curUid,
            st: self.hasInterval,
        }
        self.curWebSocket.send(JSON.stringify(param));
        //self.hasInterval = 0;
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
                tid: self.curRoomId, /**  房间id*/
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
                tid: self.curRoomId, /**  房间id*/
                score: 200,
                uids: [1001,1002,1003],
                isReConn: 1, // 1重连 0第一次连 
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