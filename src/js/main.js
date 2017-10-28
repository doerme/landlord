import POCKETARR from './lib/pocket.js';
import UTIL from './lib/util.js';
$('.loading-wrap-font').html(`${window.location.href.match(/uid=(\d+)/) ? window.location.href.match(/uid=(\d+)/)[1] : '1001'}在四处找板凳`);
setTimeout(function() {
    $('.js-loading-line').addClass('full');
}, 100);
window.localStorage.setItem('localrtime', null);

/** 房间状态 */
var ROOMSTATE = 5; /**5.游戏初始化 1.叫地主阶段 3.游戏中 2.游戏结算 */
var DFAVATAR = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=807731740,1529657662&fm=111&gp=0.jpg';
var PAGETPL = {
    mainpocketwrap: require('./tpl/mainpocketwrap.tpl'),
    pocketwrap: require('./tpl/pocketwrap.tpl'),
    resultuserlist: require('./tpl/resultlistwrap'),
}

var app = {
    hasInterval: 1, // 心跳状态
    playInterVal: null, // 玩家定时器
    timeoutInterval: null, // 倒计时显示定时器
    timeoutIntervalVal: 0, // 倒计时显示器显示值
    timeoutIntervalBeginVal: 0, // 倒计时开始值
    curWebSocket: null,
    curluid: null, // 当前房主ID
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
    // status -1不在房间  0未准备  1已准备 2游戏中 3托管中
    showSitDown: function(jdata){
        var self = this;
        if(jdata.uid == self.curUid){
            if(jdata.status == -1){
            // 自己离开
                $('.game-wrap-foot-avatar').attr({
                    src: '../img/page/head_eg.png'
                });
                $('.game-wrap-foot-gold').html(0);
                $(`.top-user-wrap > img[uid="${jdata.uid}"]`).remove();
                $('.sit-down-bt.three').removeClass('hide');
            }else if(jdata.status == 1 || jdata.status == 2 || jdata.status == 3){
            // 自己坐下
                $('.game-wrap-foot-avatar').attr({
                    src: jdata.avatar,
                    uid: jdata.uid
                });
                $('.game-wrap-foot-gold').html(jdata.score);
                $(`.top-user-wrap > img[uid="${jdata.uid}"]`).remove();
                $('.sit-down-bt.three').addClass('hide');
            }else{
                $('.sit-down-bt.three').removeClass('hide');
                if($(`.top-user-wrap > img[uid="${jdata.uid}"]`).size() == 0){
                    $('.game-wrap-foot-avatar').attr({
                        src: '../img/page/head_eg.png'
                    });
                    $('.game-wrap-foot-gold').html(0);
                    $('.top-user-wrap').append(`<img uid="${jdata.uid}" src="${jdata.avatar}" />`);
                }
            }
        }else{
            // 其他人坐下 or 离开
            if(!$('.user-info-wrap.left').attr('uid') || $('.user-info-wrap.left').attr('uid') == jdata.uid){
                if(jdata.status == -1){
                    $('.user-info-wrap.left').removeAttr('uid');
                    $('.sit-down-bt.one').addClass('hide');
                    $('.user-info-wrap.left').addClass('hide');
                    $(`.top-user-wrap > img[uid="${jdata.uid}"]`).remove();
                }else if(jdata.status == 1 || jdata.status == 2 || jdata.status == 3){
                    $('.user-info-wrap.left').attr({
                        uid: jdata.uid
                    });
                    $('.sit-down-bt.one').attr({
                        src: jdata.avatar,
                        uid: jdata.uid
                    }).removeClass('hide');
                    //name score
                    $('.user-info-wrap.left').find('.name').html(jdata.name);
                    $('.user-info-wrap.left').find('.score').html(jdata.score);
                    $('.user-info-wrap.left').removeClass('hide');
                    $(`.top-user-wrap > img[uid="${jdata.uid}"]`).remove();
                }else{
                    if($(`.top-user-wrap > img[uid="${jdata.uid}"]`).size() == 0){
                        $('.user-info-wrap.left').removeAttr('uid');
                        $('.sit-down-bt.one').addClass('hide');
                        $('.user-info-wrap.left').addClass('hide');
                        $('.top-user-wrap').append(`<img uid="${jdata.uid}" src="${jdata.avatar}" />`);
                    }
                }
            }else if(!$('.user-info-wrap.right').attr('uid') || $('.user-info-wrap.right').attr('uid') == jdata.uid){
                if(jdata.status == -1){
                    $('.user-info-wrap.right').removeAttr('uid');
                    $('.sit-down-bt.two').addClass('hide');
                    $('.user-info-wrap.right').addClass('hide');
                    $(`.top-user-wrap > img[uid="${jdata.uid}"]`).remove();
                }else if(jdata.status == 1 || jdata.status == 2 || jdata.status == 3){
                    $('.user-info-wrap.right').attr({
                        uid: jdata.uid
                    });
                    $('.sit-down-bt.two').attr({
                        src: jdata.avatar,
                        uid: jdata.uid
                    }).removeClass('hide');
                    //name score
                    $('.user-info-wrap.right').find('.name').html(jdata.name);
                    $('.user-info-wrap.right').find('.score').html(jdata.score);
                    $('.user-info-wrap.right').removeClass('hide');
                    $(`.top-user-wrap > img[uid="${jdata.uid}"]`).remove()
                }else{
                    if($(`.top-user-wrap > img[uid="${jdata.uid}"]`).size() == 0){
                        $('.user-info-wrap.right').removeAttr('uid');
                        $('.sit-down-bt.two').addClass('hide');
                        $('.user-info-wrap.right').addClass('hide');
                        $('.top-user-wrap').append(`<img uid="${jdata.uid}" src="${jdata.avatar}" />`);
                    }
                }
            }else{
                console.log('not uid match', jdata.uid);
            }
        }
        // 显示解除托管
        if(jdata.status == 3){
            $(`.js-player-avatar[uid="${jdata.uid}"]`).parent('.avatar-wrap').addClass('tuoguan');
            if(jdata.uid == self.curUid){
                $('.js-quxiaotuoguan').removeClass('hide');
            }
        }else if(jdata.status == 2){
            $(`.js-player-avatar[uid="${jdata.uid}"]`).parent('.avatar-wrap').removeClass('tuoguan');
            if(jdata.uid == self.curUid){
                $('.js-quxiaotuoguan').addClass('hide');
            }
        }
    },
    // 用户展示
    showPlayInfos: function(jdata){
        var self = this;
        // 用户信息区
        for(var n in jdata){
            self.showSitDown(jdata[n]);
        }
    },
    // 显示斗地主
    showDoudizhu: function(jdata){
        var self = this;
        // 帽子显示

        $('.hat-mark').removeClass('dizhu farm hide');
        var ctrUser = UTIL.getOPUser(self.curUid, jdata.lUid);
        if(ctrUser == 'mine'){
            $('.hat-mark.mine').addClass('dizhu');
            $('.hat-mark.left').addClass('farm');
            $('.hat-mark.right').addClass('farm');
        }else{
            if(ctrUser == 'left'){
                $('.hat-mark.left').addClass('dizhu');
                $('.hat-mark.mine').addClass('farm');
                $('.hat-mark.right').addClass('farm');
            }else if(ctrUser == 'right'){
                $('.hat-mark.right').addClass('dizhu');
                $('.hat-mark.left').addClass('farm');
                $('.hat-mark.mine').addClass('farm');
            }
        }
    },
    // 游戏可以开始显示
    showCanBegin: function(jdata){
        var self = this;

        if(jdata.playerInfos){
            // 直接渲染房间人数
            for(var n in jdata.playerInfos){
                self.showSitDown(jdata.playerInfos[n]);
            }
        }
        // 自己牌区
        $('.main-pocket-wrap').html(PAGETPL.mainpocketwrap({
            cardarr: jdata.selfCardNos,
            carddata: POCKETARR.pocketArr
        }));
        // 对方牌区
        for(var n in jdata.cardNums){
            var ctrUser = UTIL.getOPUser(self.curUid, n);
            if(ctrUser == 'left'){
                $('.pocket-num.left').html(jdata.cardNums[n]).removeClass('hide');
            }else if(ctrUser == 'right'){
                $('.pocket-num.right').html(jdata.cardNums[n]).removeClass('hide');
            }
        }
        // 地主牌堆
        $('.top-pocket-wrap').html(PAGETPL.pocketwrap({
            cardarr: jdata.threeCards,
            carddata: POCKETARR.pocketArr
        }))
        
        if(jdata.tableSt == 1){
            // 叫地主阶段
            self.showCtrlJiaoDiZhu(jdata);
        }else if(jdata.tableSt == 2){
            // 游戏进行中
            $('.top-pocket-wrap').removeClass('hide');
            if(jdata.currOpUid){
                self.showChuPaiView(jdata);
            }else{
                // 游戏中第一轮
                self.makeUpDiZhu(jdata);
            }
        }else if(jdata.tableSt == 3){
            // 游戏结算
        }

        // 心跳倒计时
        if(!self.playInterVal){
            self.playInterVal = setInterval(function(){
                self.getWSInterval();
            }, 1000);
        }

        // 缓存上一次操作时间
        if(jdata.rTime){
            window.localStorage.setItem('localrtime', jdata.rTime);
        }
        
        $('.js-game-playingui').removeClass('hide');
        $('.js-game-waittingui').addClass('hide');
    },
    // 叫地主显示
    showCtrlJiaoDiZhu: function(jdata){
        var self = this;
        self.showTimeoutClock(jdata ? jdata.currOpUid : '', self.timeoutIntervalBeginVal);
        if(jdata && jdata.currOpUid == self.curUid){
            self.showGameBt(1);
        }else{
            self.showGameBt();
        }
        $('.jiaodizhu-tips').addClass('hide');
        var ctrUser = UTIL.getOPUser(self.curUid, jdata.lUid);
        if(ctrUser == 'mine'){
            $('.jiaodizhu-tips.mine').removeClass('hide');
        }else if(jdata){
            if(ctrUser == 'left'){
                $('.jiaodizhu-tips.left').removeClass('hide');
            }else if(ctrUser == 'right'){
                $('.jiaodizhu-tips.right').removeClass('hide');
            }
        }
    },
    //  显示倒计时
    showTimeoutClock: function(opuid, timeoutval){
        var self = this;
        if(!opuid){
            return;
        }
        $('.timeout-clock').addClass('hide');
        $('.user-timeout-clock').addClass('hide');
        var ctrUser = UTIL.getOPUser(self.curUid, opuid);
        if(ctrUser == 'mine'){
            $('.timeout-clock').removeClass('hide');
        }else{
            if(ctrUser == 'left'){
                $('.user-timeout-clock.left').removeClass('hide');
            }else if(ctrUser == 'right'){
                $('.user-timeout-clock.right').removeClass('hide');
            }
        }
        self.timeoutIntervalVal = timeoutval;
        clearInterval(self.timeoutInterval);
        $('.timeout-clock').html(self.timeoutIntervalVal);
        $('.user-timeout-clock').html(self.timeoutIntervalVal);
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
        self.showCtrlJiaoDiZhu();
        // 插入地主牌
        if(jdata.lUid == self.curUid){
            $('.main-pocket-wrap-bottom').append($('.top-pocket-wrap').html());
            $('.main-pocket-wrap').html(PAGETPL.mainpocketwrap({
                cardarr: UTIL.deskRebuild(),
                carddata: POCKETARR.pocketArr
            }))
        }
        self.showChuPaiCtrl(jdata.lUid);
        self.showTimeoutClock(jdata ? jdata.lUid : '', self.timeoutIntervalBeginVal);
    },
    // 出牌展示
    showChuPaiView: function(jdata){
        var self = this;
        var ctrUser = UTIL.getOPUser(self.curUid,jdata.lastOpUid);
        if(jdata.lastCardNos && jdata.lastCardNos.length > 0){
            $('.js-chupaiqu-wrap').html(PAGETPL.pocketwrap({
                cardarr: jdata.lastCardNos,
                carddata: POCKETARR.pocketArr,
                fromuser: ctrUser
            })).removeClass('hide');
        }

        // 减牌
        if(jdata.lastCardNos && jdata.lastOpUid == self.curUid){
            for(var n in jdata.lastCardNos){
                $(`.main-pocket-wrap .pok[pknum="${jdata.lastCardNos[n]}"]`).remove();
            }
            $('.main-pocket-wrap').html(PAGETPL.mainpocketwrap({
                cardarr: UTIL.deskRebuild(),
                carddata: POCKETARR.pocketArr
            }))
        }

        if(jdata.lastOpCardNum){
            if(ctrUser == 'left'){
                $('.pocket-num.left').html(jdata.lastOpCardNum).removeClass('hide');
            }else if(ctrUser == 'right'){
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
    // 游戏结束
    showGameEnd: function(jdata){
        var self = this;
        if(jdata.winUid){
            $('.game-result-main').removeClass('pm-win pm-lose dz-win dz-lose');
            if(jdata.winUid == self.curUid){
                // 胜利
                if(self.curluid == self.curUid){
                    //地主胜利
                    $('.game-result-main').addClass('dz-win');
                }else{
                    //平民胜利
                    $('.game-result-main').addClass('pm-win');
                }
            }else{
                // 失败
                if(self.curluid == self.curUid){
                    //地主失败
                    $('.game-result-main').addClass('pm-lose');
                }else{
                    //平民失败
                    $('.game-result-main').addClass('pm-lose');
                }
            }
            // 倍数显示
            if(jdata.multiple){
                $('.js-multiple-show').html(`本盘总倍数：${jdata.multiple}倍`);
            }
            setTimeout(()=>{
                $('.js-game-result-wrap').removeClass('hide');
            }, 4000);
        }
        $('.js-result-user-list').html(PAGETPL.resultuserlist({
            data: jdata.playerInfos
        }));

        // 取消托管ui
        $('.js-chupaiqu-wrap').html('');
        $('.js-quxiaotuoguan').addClass('hide');
        $('.js-player-avatar').parent('.avatar-wrap').removeClass('tuoguan');

    },
    // 出牌轮换
    showChuPai: function(jdata){
        var self = this;
        self.showChuPaiCtrl(jdata.uid);
        self.showTimeoutClock(jdata ? jdata.uid : '', self.timeoutIntervalBeginVal);
    },
    // 当前出牌UI展示
    showChuPaiCtrl: function(playuid){
        var self = this;
        $('.js-mybt').addClass('hide');
        if(playuid == self.curUid){
            $('.bt-chupai,.bt-buchu').removeClass('hide');
        }
    },
    // 游戏界面重置
    gameEndReset: function(){
        var self = this;
        $('.js-game-playingui').addClass('hide');
        $('.js-game-waittingui').removeClass('hide');
        $('.js-game-result-wrap').addClass('hide');
        $('.user-timeout-clock').addClass('hide');
        $('.top-pocket-wrap').addClass('hide');
        self.gameLogin();
    },
    // 起身
    gameStandUp: function(){
        var self = this;
        $('.game-wrap-foot-avatar').attr({
            src: './img/page/head_eg.png'
        })
        self.gameEndReset();
    },
    // 游戏登录
    gameLogin: function(){
        var self = this;
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

        // 取消托管
        $('.js-quxiaotuoguan').on('click', function(){
            if(self.curWebSocket){
                var param = {
                    type: 'chgSt',
                    uid: self.curUid,
                    op: '0',
                }
                self.curWebSocket.send(JSON.stringify(param));
            }else{
                console.log('websocket not exist');
            }
            $('.js-quxiaotuoguan').addClass('hide');
            $('.avatar-wrap.tuoguan').removeClass('tuoguan');
        })

        // 结束继续
        $('.js-rs-bt1').on('click', function(){
            self.gameEndReset();
        })

        // 结束站起
        $('.js-rs-bt2').on('click', function(){
            self.gameStandUp();
        })

        // 离开 站起来
        $('.js-quit-desk,.js-stand-desk').on('click', function(){
            self.gameStandUp();
        });

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
            $('.js-setting-wrap').removeClass('hide');
        })
        // 设置弹窗隐藏
        $('.setting-wrap-mask').on('click', function(){
            $('.js-setting-wrap').addClass('hide');
        })
        // 设定开关
        $('.js-bt-switch').on('click', function(){
            if($(this).hasClass('off')){
                $(this).removeClass('off');
            }else{
                $(this).addClass('off');
            }
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

        // 换台
        $('.js-switch-desk').on('click', function(){
            UTIL.windowToast('此功能尚未开放');
        });
    },
    beginWS: function(){
        var self = this;
        var option = {
            //url: 'ws://120.26.207.102:7272',
            url: 'ws://192.168.1.250:7272',
            callback: function(jdata){
                if(typeof(jdata) == 'string'){
                    jdata = JSON.parse(jdata);
                }
                console.log('ws cb', jdata);
                // 心跳设置
                if(jdata.type == 'test' && jdata.uid == '-1'){
                    self.hasInterval = 0;
                }
                // 倒计时开始时间覆盖
                if(jdata.playTime || jdata.landlordTime){
                    self.timeoutIntervalBeginVal = jdata.playTime || jdata.landlordTime;
                }

                // 重连倒计时操作
                if(jdata.nowTime && window.localStorage.getItem('localrtime')){
                    self.timeoutIntervalBeginVal = self.timeoutIntervalBeginVal - (jdata.nowTime - window.localStorage.getItem('localrtime'));
                    self.showTimeoutClock(jdata ? jdata.currOpUid : '', self.timeoutIntervalBeginVal);
                    console.log('reset time begin val', self.timeoutIntervalBeginVal);
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

                    // 地主带帽
                    if(jdata.lUid){
                        self.curluid = jdata.lUid;
                        self.showDoudizhu(jdata);
                    }
                }
                if(jdata.type == 'play'){
                    if(jdata.s == 7){
                        UTIL.windowToast('非法出牌');
                    }else if(jdata.s == 1){
                        self.showChuPaiView(jdata);
                    }
                    // 游戏结束
                    if(jdata.winUid){
                        self.showGameEnd(jdata);
                    }
                    if(jdata.playerInfos){
                        // 直接渲染房间人数
                        for(var n in jdata.playerInfos){
                            self.showSitDown(jdata.playerInfos[n]);
                        }
                    }
                }

                // 登录成功
                if(jdata.type == 'login' && jdata.s == 1){
                    if(jdata.playerInfos){
                        // 直接渲染房间人数
                        for(var n in jdata.playerInfos){
                            self.showSitDown(jdata.playerInfos[n]);
                        }
                    }
                }
                // 登录失败
                if(jdata.type == 'login' && jdata.s == -1){
                    UTIL.windowToast('登录失败，请重试');
                }

                // 等待人齐阶段
                if(jdata.type == 'jt'){
                    // self.getWSInterval();
                    if(jdata.playerInfos){
                        // 直接渲染房间人数
                        for(var n in jdata.playerInfos){
                            self.showSitDown(jdata.playerInfos[n]);
                        }
                    }else if(jdata.player){
                        // 显示人 加入 or 离开
                        self.showSitDown(jdata.player);
                    }
                }

                if(jdata.tableInfo){
                    // 显示牌局
                    self.showCanBegin(jdata.tableInfo);
                }

                // 缓存上一次操作时间
                if(jdata.rTime){
                    window.localStorage.setItem('localrtime', jdata.rTime);
                }
            }
        }
        self.initSocket(option);
    },
    getWSInterval: function(){
        var self = this;
        console.log('getWSInterval');
        if(self.curWebSocket){
            var self = this;
            var param = {
                type: 'test',
                uid: self.curUid,
                st: self.hasInterval,
            }
            self.curWebSocket.send(JSON.stringify(param));
        }else{
            console.log('web socket not exist');
        }
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
            self.gameLogin();
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