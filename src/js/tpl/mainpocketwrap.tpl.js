/*TMODJS:{"version":7,"md5":"311be0d4bcdd7b2b9d59ae6dfecf5209"}*/
template("/Users/xiaominghari/Documents/wanrenqun/newsvn/web/landlord/landlord/src/js/tpl/mainpocketwrap",function(a){"use strict";var b=this,c=(b.$helpers,b.$each),d=a.cardarr,e=(a.v,a.i,b.$escape),f=a.carddata,g="";return g+='<div class="main-pocket-wrap-top"> ',c(d,function(a,b){g+=" ",10>b&&(g+=' <img class="pok" src="',g+=e(f[a]),g+='" pknum="',g+=e(a),g+='" /> '),g+=" "}),g+=' </div> <div class="main-pocket-wrap-bottom"> ',c(d,function(a,b){g+=" ",b>=10&&(g+=' <img class="pok" src="',g+=e(f[a]),g+='" pknum="',g+=e(a),g+='" /> '),g+=" "}),g+=" </div>",new String(g)});