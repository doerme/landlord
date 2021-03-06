import LegoToast from './legoToast.min.js';
import wechatShare from './wechatShare.js';
export default {
    apiHost: '',
    legoToast: new LegoToast({
        msg        : "操作成功",
        time       : 1200,
        extraclass : "extraclass"
    }),
    windowToast: function(msg, mtime){
        this.legoToast.changeText(msg || 'toast'); // 修改文案
        this.legoToast.open(); // 再次打开
    },
    ajaxFun: function(url, requestData){
        var self = this;
        return $.ajax({
            url: this.apiHost + url,
            type: 'get',
            dataType: 'jsonp',
            timeout: 8000,
            data: $.extend(requestData,{token: window.testtoken})
        }).done((jdata)=>{
            //console.log('global done', jdata);
            if(jdata.code == -1 || jdata.code == '-1'){
            }
            if(jdata.code != 0){
                self.windowToast(jdata.msg || '操作失败，请重试');
            }
        }).fail((jdata)=>{
            self.windowToast(jdata.msg || '操作失败，请重试');
        })
    },
    ajaxGet: function(url, requestData){
        var self = this;
        return $.ajax({
            url: this.apiHost + url,
            type: 'get',
            dataType: 'json',
            timeout: 8000,
            data: $.extend(requestData,{token: window.testtoken})
        }).done((jdata)=>{
            //console.log('global done', jdata);
            if(jdata.code == -1 || jdata.code == '-1'){
            }
            if(jdata.code != 0){
                self.windowToast(jdata.msg || '操作失败，请重试');
            }
        }).fail((jdata)=>{
            self.windowToast(jdata.msg || '操作失败，请重试');
        })
    },
    ajaxPost: function(url, requestData){
        var self = this;
        return $.ajax({
            url: this.apiHost + url +'?token=' + window.testtoken,
            type: 'POST',
            timeout: 8000,
            data: $.extend(requestData,{token: window.testtoken})
        }).done((jdata)=>{
            if(jdata.code == -1 || jdata.code == '-1'){
            }
            if(jdata.code != 0){
                self.windowToast(jdata.msg || '操作失败，请重试');
            }
        }).fail((jdata)=>{
            self.windowToast(jdata.msg || '操作失败，请重试');
        })
    },
    wechatShareInit: function(jdata){
        wechatShare(jdata);
    },
    getURLParam: function(name, url) {
        var re = new RegExp("[\\?&#]" + name + "=([^&#]+)", "gi");
        var ma = (url || location.href).match(re);
        var strArr;
        if (ma && ma.length > 0) {
            strArr = (ma[ma.length - 1]);
            var _index = strArr.indexOf("=");
            return strArr.substring(_index + 1);
        }
        return '';
    },
    setCookie: function(c_name, value, expiredays) {
        try {
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie = c_name + "=" + escape(value) +
                ((expiredays == null) ? "" : ";domain=.mezhibo.com;path=/;expires=" + exdate.toGMTString())
        } catch (e) {
            console.error('setCookie e', e)
        }
    },
    getCookie: function(c_name) {
        var c_start = null,
            c_end = null;
        try {
            if (document.cookie && document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=")
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1
                    c_end = document.cookie.indexOf(";", c_start)
                    if (c_end == -1) c_end = document.cookie.length
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        } catch (e) {
            console.error('getCookie e', e);
            return "";
        }
    },
    timeformatshow: function(second) {
        var h = Math.floor(second / 3600);
        var m = Math.floor((second - h * 3600)/60);
        var s = Math.ceil((second-h * 3600) % 60);
        return `${this.pad(h,2)}:${this.pad(m,2)}:${this.pad(s,2)}`;
    },
    pad: function(num, n) {  
        return Array(n>(num+'').length? (n-(''+num).length+1):0).join(0)+num;  
    }, 
    is_weixn: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    nullArray: function(num){
        var arr=[];
        for(var n=1; n<=num; n++){
            arr.push(n);
        }
        return arr;
    },
    getChuPai: function(){
        var rsArr = [];
        $('.main-pocket-wrap .selected').each(function(){
            rsArr.push($(this).attr('pknum'));
        })
        return rsArr;
    },
    isInArr: function(arr, val){
        for(var n in arr){
            if(val == arr[n]){
                return true;
            }
        }
        return false;
    },
    isArrSame: function(arr1, arr2){
        if(arr1.length != arr2.length ){
            return false;
        }
        for(var n  in  arr1){
            if(arr1[n]*1 != arr2[n]*1){
                return false;
            }
        }
        return true;
    },
    deskHadbuild: function(ctrUser){
        var rsArr = [];
        var $chupai = null;
        if(ctrUser == 'mine'){
            $chupai = $('.chupaiqu-wrap-mine');
        }else if(ctrUser == 'left'){
            $chupai = $('.chupaiqu-wrap-left');
        }else if(ctrUser == 'right'){
            $chupai = $('.chupaiqu-wrap-right');
        }
        $chupai.each(function(){
            rsArr.push($(this).attr('pknum') * 1);
        });
        return rsArr.sort((a, b)=> b-a);
    },
    deskRebuild: function(isR){
        var rsArr = [];
        $('.main-pocket-wrap .pok').each(function(){
            rsArr.push($(this).attr('pknum') * 1);
        });
        if(isR){
            return rsArr.sort((a, b)=> a-b);
        }else{
            return rsArr.sort((a, b)=> b-a);
        }
        
    },
    getOPUser: function(curuid, opuid){
        if(curuid == opuid){
            return 'mine';
        }else{
            if($(`.user-info-wrap[uid="${opuid}"]`).hasClass('left')){
                return 'left';
            }else if($(`.user-info-wrap[uid="${opuid}"]`).hasClass('right')){
                return 'right';
            }
        }
    },
    soundInit: function(){
        // 结束音频
        createjs.Sound.registerSound("/assets/ogg/result/SpecBeanMore.mp3", 'SpecBeanMore');

        // 普通出牌
        createjs.Sound.registerSound("/assets/ogg/common/Man_dani1.mp3", 'dani1');
        createjs.Sound.registerSound("/assets/ogg/common/Man_dani2.mp3", 'dani2');
        createjs.Sound.registerSound("/assets/ogg/common/Man_dani3.mp3", 'dani3');

        // 地主
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_NoOrder.mp3", 'dizhuNo1');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_NoRob.mp3", 'dizhuNo2');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Order.mp3", 'dizhuYes1');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Rob1.mp3", 'dizhuYes2');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Rob2.mp3", 'dizhuYes3');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Rob3.mp3", 'dizhuYes4');

        // 不要
        createjs.Sound.registerSound("/assets/ogg/buyao/Man_buyao1.mp3", 'buyao1');
        createjs.Sound.registerSound("/assets/ogg/buyao/Man_buyao2.mp3", 'buyao2');
        createjs.Sound.registerSound("/assets/ogg/buyao/Man_buyao3.mp3", 'buyao3');
        createjs.Sound.registerSound("/assets/ogg/buyao/Man_buyao4.mp3", 'buyao4');

        // 特效
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_feiji.mp3", 'feiji');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_liandui.mp3", 'liandui');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_sandaiyi.mp3", 'sandaiyi');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_sandaiyidui.mp3", 'sandaiyidui');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_shunzi.mp3", 'shunzi');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_sidaier.mp3", 'sidaier');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_sidailiangdui.mp3", 'sidailiangdui');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_wangzha.mp3", 'wangzha');
        createjs.Sound.registerSound("/assets/ogg/texiao/Man_zhadan.mp3", 'zhadan');

        // 单支
        createjs.Sound.registerSound("/assets/ogg/single/Man_1.mp3", 'sin1');
        createjs.Sound.registerSound("/assets/ogg/single/Man_2.mp3", 'sin2');
        createjs.Sound.registerSound("/assets/ogg/single/Man_3.mp3", 'sin3');
        createjs.Sound.registerSound("/assets/ogg/single/Man_4.mp3", 'sin4');
        createjs.Sound.registerSound("/assets/ogg/single/Man_5.mp3", 'sin5');
        createjs.Sound.registerSound("/assets/ogg/single/Man_6.mp3", 'sin6');
        createjs.Sound.registerSound("/assets/ogg/single/Man_7.mp3", 'sin7');
        createjs.Sound.registerSound("/assets/ogg/single/Man_8.mp3", 'sin8');
        createjs.Sound.registerSound("/assets/ogg/single/Man_9.mp3", 'sin9');
        createjs.Sound.registerSound("/assets/ogg/single/Man_10.mp3", 'sin10');
        createjs.Sound.registerSound("/assets/ogg/single/Man_11.mp3", 'sin11');
        createjs.Sound.registerSound("/assets/ogg/single/Man_12.mp3", 'sin12');
        createjs.Sound.registerSound("/assets/ogg/single/Man_13.mp3", 'sin13');
        createjs.Sound.registerSound("/assets/ogg/single/Man_14.mp3", 'sin14');
        createjs.Sound.registerSound("/assets/ogg/single/Man_15.mp3", 'sin15');

        // 对
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui1.mp3", 'dui1');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui2.mp3", 'dui2');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui3.mp3", 'dui3');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui4.mp3", 'dui4');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui5.mp3", 'dui5');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui6.mp3", 'dui6');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui7.mp3", 'dui7');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui8.mp3", 'dui8');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui9.mp3", 'dui9');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui10.mp3", 'dui10');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui11.mp3", 'dui11');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui12.mp3", 'dui12');
        createjs.Sound.registerSound("/assets/ogg/dui/Man_dui13.mp3", 'dui13');

        // 三
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple1.mp3", 'tuple1');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple2.mp3", 'tuple2');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple3.mp3", 'tuple3');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple4.mp3", 'tuple4');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple5.mp3", 'tuple5');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple6.mp3", 'tuple6');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple7.mp3", 'tuple7');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple8.mp3", 'tuple8');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple9.mp3", 'tuple9');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple10.mp3", 'tuple10');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple11.mp3", 'tuple11');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple12.mp3", 'tuple12');
        createjs.Sound.registerSound("/assets/ogg/tuple/Man_tuple13.mp3", 'tuple13');

        // 剩下牌
        createjs.Sound.registerSound("/assets/ogg/rest/Man_baojing1.mp3", 'baojing1');
        createjs.Sound.registerSound("/assets/ogg/rest/Man_baojing2.mp3", 'baojing2');
    },
    SoundRest: function(num){
        setTimeout(()=>{
            if(num == 2){
                createjs.Sound.play('baojing2');
            }else if(num == 1){
                createjs.Sound.play('baojing1');
            }
        },1200);
    },
    SoundSingle: function(num){
        if(num == 14){
            createjs.Sound.play('sin1');
        }else if(num == 15){
            createjs.Sound.play('sin2');
        }else if(num == 16){
            createjs.Sound.play('sin14');
        }else if(num == 17){
            createjs.Sound.play('sin15');
        }else{
            createjs.Sound.play(`sin${num}`);
        }
    },
    SoundDouble: function(num){
        if(num == 14){
            createjs.Sound.play('dui1');
        }else if(num == 15){
            createjs.Sound.play('dui2');
        }else if(num == 16){
            createjs.Sound.play('dui14');
        }else if(num == 17){
            createjs.Sound.play('dui15');
        }else{
            createjs.Sound.play(`dui${num}`);
        }
    },
    SoundTuple: function(num){
        if(num == 14){
            createjs.Sound.play('tuple1');
        }else if(num == 15){
            createjs.Sound.play('tuple2');
        }else if(num == 16){
            createjs.Sound.play('tuple14');
        }else if(num == 17){
            createjs.Sound.play('tuple15');
        }else{
            createjs.Sound.play(`tuple${num}`);
        }
    },
    showChatSound: function(jdata){
        var self = this;
        if(jdata.msg == '叫地主'){
            createjs.Sound.play('dizhuYes1');
        }else if(jdata.msg == '不叫'){
            createjs.Sound.play('dizhuNo1');
        }
    },
    pokRunDown: function(){
        console.log('pokRunDown');
        var $box = $('.js-animate-wrap .animate-wrap-mine .pok');
        var $line = $('.main-pocket-wrap .pok');
        var $boxleft = $('.js-animate-wrap .animate-wrap-left .pokback');
        var $boxright = $('.js-animate-wrap .animate-wrap-right .pokback');
        $box.removeClass('hide');
        $line.addClass('notshow');
        $boxleft.removeClass('hide');
        $boxright.removeClass('hide');
        var cptime = 0;
        var backtime = 0;
        var xOffet = window.innerWidth/2 - $('.js-animate-wrap .animate-wrap-mine .pok').eq(0).width()/2 - 15;
        var yOffet = $('.main-pocket-wrap').position().top - $('.js-animate-wrap').position().top;
		$box.each(function(index){
            console.log(index, $line.eq(index).position().left, yOffet);
            var unitYOffset = 0;
            if($line.eq(index).position().top != $line.eq(0).position().top){
                unitYOffset = $('.js-animate-wrap .animate-wrap-mine .pok').eq(0).height() + 15;
            }
			TweenLite.to($(this), 0.5, {
				transform: 'translate('+ ($line.eq(index).position().left - xOffet) +'px, '+ (yOffet * 1 + unitYOffset) +'px)',
				delay: index/10,
				onComplete: seComplete
			},);
        });
        
        $boxleft.each(function(index){
			TweenLite.to($(this), 0.5, {
                left: $('.js-animate-wrap').position().left - $('.pocket-num.left').position().left + $('.js-animate-wrap .animate-wrap-mine .pok').eq(0).width()/2+ $('.pocket-num.left').width()/2,
                top: $('.js-animate-wrap').position().top - $('.pocket-num.left').position().top + $('.pocket-num.left').width()/2,
                width: $('.pocket-num.left').width(),
                height: $('.pocket-num.left').height(),
                delay: index/10,
			},);
        });

        $boxright.each(function(index){
			TweenLite.to($(this), 0.5, {
                left: $('.js-animate-wrap').position().left - $('.pocket-num.right').position().left + $('.js-animate-wrap .animate-wrap-mine .pok').eq(0).width()/2+ $('.pocket-num.left').width()/2,
                top: $('.js-animate-wrap').position().top - $('.pocket-num.right').position().top + $('.pocket-num.left').width()/2,
                width: $('.pocket-num.left').width(),
                height: $('.pocket-num.left').height(),
                delay: index/10,
				onComplete: sebackComplete
			},);
        });

		function seComplete(){
            $line.eq(cptime).removeClass('notshow');
            $box.eq(cptime).addClass('hide');
			cptime++;
        }
        function sebackComplete(){
            $boxleft.eq(backtime).addClass('hide');
            $boxright.eq(backtime).addClass('hide');
            backtime++;
        }
    }
}