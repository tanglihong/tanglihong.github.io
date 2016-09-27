---
title: work note
date: 2016-09-14 10:34:46
tags: note
---
第一次写，很紧张...
##### 1、arguments.callee
 &#160; &#160; &#160; &#160;返回当前正在执行的function对象。在函数内部有两个特殊的对象：arguments和this，其中arguments是一个数组类对象，包含传入函数的所有参数；而this则表示的是函数在执行时所处的作用域。callee是arguments对象的一个属性，指向的就是拥有这个arguments的函数。

为什么要记这个，因为在很久很久以前我第一次看到这货时，我竟然是懵逼的...
常使用场景：在定时器内调用自身或函数内部递归调用自身
注意事项：严格模式下("user strict")不能使用

<!--more-->

##### 2、css处理文本超过div宽度自动换行
```
word-wrap: break-word（会对长单词另起一行）
word-break: break-all（强制断句不换行）
```
##### 3、阻止事件捕获/冒泡
```
$("#div").on("touchmove",function(event){
    var e=window.event||event;
if(e.stopPropagation){
    e.stopPropagation();
}else{
    window.event.cancelBubble=true;
	}
})
```
之前遇到一个问题，手机页面里有一个div，div的超出内容是scroll的，当滚动div的内容不想页面跟随滚动，后面仔细一想其实就是阻止事件捕获，以上是兼容写法。

##### 4、节流两种方式简单实现
```
var  debounce=function (action, idle) {//在idle时间内只执行action一次
    var i = null;
    return function () {
        clearTimeout(i);
        i = setTimeout(function () {
            action.apply(this, arguments);
        }, idle)
    }
};
var  throttle= function(action, delay){//每delay时间执行action一次
    var last = 0;
    return function(){
        var curr = +new Date();
        if (curr - last > delay){
            action.apply(this, arguments);
            last = curr;
        }
    }
};
```
##### 5、网站整体变成灰白色
```
<html style="filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);-webkitfiltegrayscale(100%);"/>
```
这段代码的使用场景我想不言而喻。

##### 6、网页禁止右键：
```
oncontextmenu="return false;"
document.oncontextmenu=function(a){return !1}
```
事件显示按了哪个键：event.which

##### 7、DOM文档加载顺序
```
 * 解析HTML结构。
 * 加载外部脚本和样式表文件。
 * 解析并执行脚本代码。
 * 构造HTML DOM模型。//ready
 * 加载图片等外部文件。
 * 页面加载完毕。//load
```
##### 8、BFC（清除浮动）
如果要把BFC(块级格式化上下文)讲清楚，恐怕得单独写一章，我还不一定说得清楚，而且网上好的文章有很多，此处只记录其中的一种作用-清除浮动，也是我们项目中所用的比较兼容的写法。
```
.clearfix:before,
.clearfix:after { /*直接copy的项目中的源码，好像只写after就行了吧*/
    content: " ";
    display: table;
}
.clearfix:after {
    clear: both;
}
.clearfix {
    *zoom: 1;
}
```
##### 9、ie各个版本hack

![ie 各个版本hack](/images/ie_hack.png)
兼容IE版本的css写法差不多就如上面所示，但曾经在项目中也遇到过坑，大意是给一个div加上box-shadow，IE则是用filter模拟生成，代码如下：
```
.div{
-moz-box-shadow: 0 0 8px rgba(0,0,0,0.3);
-webkit-box-shadow: 0 0 8px rgba(0,0,0,0.3);
box-shadow: 0 0 8px rgba(0,0,0,0.3);
filter:progid:DXImageTransform.Microsoft.Shadow(color=#dbdbdb,direction=0,strength=5) progid:DXImageTransform.Microsoft.Shadow(color=#dddddd,direction=90,strength=5) progid:DXImageTransform.Microsoft.Shadow(color=#dddddd,direction=180,strength=4) progid:DXImageTransform.Microsoft.Shadow(color=#d2d2d2,direction=270,strength=3); 
}
```
本来效果是可以的，但在IE9下切换却出现了如下的黑框：
![谁在上网-黑边框](/images/谁在上网-黑边框.gif)
原因大概就是IE9本身已经支持了box-shadow，而再加上filter的属性就出现了这种情况，解决的办法也很简单，只让IE7 8识别filter滤镜就好了。但对比上面的hack，发现并没有只有让IE8及其以下识别的写法，我的解决方法是这样的：
```
<!--[if lte IE 8]>
<style>
.div{
filter:progid:DXImageTransform.Microsoft.Shadow(color=#dbdbdb,direction=0,strength=5) progid:DXImageTransform.Microsoft.Shadow(color=#dddddd,direction=90,strength=5) progid:DXImageTransform.Microsoft.Shadow(color=#dddddd,direction=180,strength=4) progid:DXImageTransform.Microsoft.Shadow(color=#d2d2d2,direction=270,strength=3); 
}
</style>
<![endif]-->
```
##### 10、js各种数据类型比较
* 如果比较的两者中有布尔值(Boolean)，会把 Boolean 先转换为对应的 Number，即 0 和 1，然后进行比较。
* 如果比较的双方中有一方为 Number，一方为 String时，会把 String 通过 Number() 方法转换为数字，然后进行比较。
* 如果比较的双方中有一方为 Boolean，一方为 String时，则会将空字符串""转换为 false，除此外的一切字符串转换为 true，然后进行比较。
* 如果比较的双方中有一方为 Number，一方为Object时，则会调用 valueOf 方法将Object转换为数字，然后进行比较。//这一条不是太理解

##### 总结

&#160; &#160; &#160; &#160;在写的时候，内心有很多独白，后面又忍住删了，既然是笔记就要显得专业些，口水话的内容等有时间就另起灶炉水个够。
&#160; &#160; &#160; &#160;以上内容属个人笔记，如若有误也没法联系，后面看需添加评论模块吧。