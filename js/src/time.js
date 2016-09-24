 (function () {
        var timeDiv=document.getElementsByClassName("nowTime");
        for(var i= 0,len=timeDiv.length;i<len;i++){
            var ul=document.createElement("ul");
            ul.className="time";
            for(var k=0;k<=9;k++){
                var li=document.createElement("li");
                li.innerHTML=k;
                ul.appendChild(li);
            }
            timeDiv[i].appendChild(ul);
        }
        var time=document.getElementsByClassName("time");
        function clock() {
            var oDate = new Date(),
                    oH = oDate.getHours(),
                    oM = oDate.getMinutes(),
                    oS = oDate.getSeconds();
            var timeStr = check(oH) + check(oM) + check(oS);
            for (var i = 0, len = timeStr.length; i < len; i++) {
                var n=timeStr.charAt(i),t=time[i].style;
                t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = "500ms";
                t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform=" translate3d(0,"+(-n * 36)+"px,0)";
                n==0&&(t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration="0ms");
            }
        }
        clock();
        setInterval(clock,1000);
        function check(s){
            return  s<10?"0"+s:""+s;
        }
    })()