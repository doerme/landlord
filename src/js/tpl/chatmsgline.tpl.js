/*TMODJS:{"version":10,"md5":"d3a078a6debc8457bddf6485de9d8b2e"}*/
template("E:/wamp/www/Jeremy/panya/newweb/landlord/src/js/tpl/chatmsgline",function(a){"use strict";var b=this,c=(b.$helpers,a.data),d=b.$escape,e="";return"1"==c.ct?(e+=" <li>",e+=d(c.name),e+=":",e+=d(c.msg),e+="</li> "):"2"==c.ct&&(e+=" <li>",e+=d(c.name),e+=':<img class="e-unit" src="../img/page/face/',e+=d(1*c.msg+1),e+='.png" /></li> '),new String(e)});