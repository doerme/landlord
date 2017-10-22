## 接口文档
[ws文档](http://testddz.tcpan.com/README.html)
[后端文档]()
## 第三方库文档
```
{
    css:{
      left:100,
      opacity:0.3
    },
    startAt:{left:10}, //初始化
    delay:0, //1秒后开始执行动画
    ease:Back.easeOut, //加速度效果
    repeat:0, //多循环1次，也就是一共重复执行了2次同样的动画，-1就会无限重复循环
    repeatDelay:0, //每次重复循环时间3秒,需要配合repeat属性
    yoyo:false, //如果true，动画的循环是倒序，需要配合repeat属性
    paused:false, //如果true,动画暂停
    overwrite:'auto',
    onStart:function(){ //动画开始前回调
       document.title='开始前执行'
    },
    onStartParams:["{self}", "参数"],
    onComplete:function(a,b){ //动画结束后回调
       document.title='动画完成'
    },
    onCompleteParams:["{self}", "param2"], //为onComplete传参数，其中{self}值的是mov
    immediateRender:true,
    onUpdate:function(a,b){ //初始化执行一次，动画过程回调，以后动画有运动都还会不停的执行，直到动画结束才停止
      // console.log(a.isActive());
    },
    onUpdateParams:["{self}", "参数"], //为onUpdate提供参数
    useFrames:false
 });
```

## 第三方库文档