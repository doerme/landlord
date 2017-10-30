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
    deskHadbuild: function(){
        var rsArr = [];
        $('.js-chupaiqu-wrap .pok').each(function(){
            rsArr.push($(this).attr('pknum') * 1);
        });
        return rsArr.sort((a, b)=> b-a);
    },
    deskRebuild: function(){
        var rsArr = [];
        $('.main-pocket-wrap .pok').each(function(){
            rsArr.push($(this).attr('pknum') * 1);
        });
        return rsArr.sort((a, b)=> b-a);
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
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_NoOrder.ogg", 'dizhuNo1');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_NoRob.ogg", 'dizhuNo2');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Order.ogg", 'dizhuYes1');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Rob1.ogg", 'dizhuYes2');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Rob2.ogg", 'dizhuYes3');
        createjs.Sound.registerSound("/assets/ogg/dizhu/Man_Rob3.ogg", 'dizhuYes4');
    },
    showChatSound: function(jdata){
        var self = this;
        if(jdata.msg == '叫地主'){
            createjs.Sound.play('dizhuYes1');
        }else if(jdata.msg == '不叫地主'){
            createjs.Sound.play('dizhuNo1');
        }else if(jdata.msg == '要不起'){
            createjs.Sound.play('dizhuNo1');
        }else if(jdata.msg == '出牌'){
            createjs.Sound.play('dizhuNo1');
        }
    },
}