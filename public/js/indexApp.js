/**
 * Created by lixifeng on 17/1/6.
 */
/**
 * 首页JS引用文件
 */
//是否显示日志
var c_showLog =  true;
//浏览器大小改变,是否刷新页面
var c_changescreen = true;


//重写日志系统
window.log =function (obj) {
    //
    if(c_showLog){
        console.log(obj);
    }
};



/**
 * 判断是否微信客户端
 * */
function IsPC() {
    var userAgentInfo = navigator.userAgent.toLowerCase();
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v].toLowerCase()) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//浏览器大小改变,是否刷新页面
window.onresize = function(){

    if(!window.plus&&IsPC()){
        //不在APP中,进行处理
        if(c_changescreen){
            window.location.reload();
        }
    }


}

//下载JS
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if(typeof(callback) != "undefined"){
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
    }
    script.src = url;
    document.body.appendChild(script);
}
var loadJSSuccess = false;
function loadJS(isApp,callBack) {
    //只下载一次
    if(loadJSSuccess){
        return;
    }
    loadJSSuccess = true;


    //进入项目

    // 获取本地应用资源版本号


    if(window.plus&&window.checkUpdate){
        setTimeout(function () {
            plus.runtime.getProperty(plus.runtime.appid,function(inf){
                var wgtVer=inf.version;
                checkUpdate(wgtVer,function (progress) {
                    var para=document.getElementById("indexUpDataPro")
                    para.innerHTML = progress;
                },function (message) {
                    var para=document.getElementById("indexUpDataMessage")
                    para.innerHTML = para.innerHTML+'<p>'+message+'</p>';
                },function (state) {

                    if(state){
                        //是否马上重启
                        // plus.runtime.restart();
                        // 下次重启生效
                        openApp(callBack);
                    }else{
                        // alert("没有更新成功");
                        openApp(callBack);
                    }

                });

            });
        },1000)

    }else{
        openApp(callBack);
    }

}

function openApp(callBack) {
    //判断是否可以更新
    function fadeOut(el,callBack) {

        el.style.opacity = 1;
        el.style.display="";

        var last = +new Date();
        var tick = function() {
            el.style.opacity = +el.style.opacity - (new Date() - last) / 1000;
            last = +new Date();

            if (+el.style.opacity >0) {

                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }else{
                if(typeof(callBack) != "undefined") {
                    callBack();
                }
                document.body.removeChild(el)
            }
        };
        tick();
    }

    loadScript("project/spa.js",function(){
//                alert("加载bundle完毕");
//             alert("完成");
        //完成
        var para=document.getElementById("root_load")
        if(para){
            fadeOut(para,callBack);
        }
    });
}

// 检测更新

if(window.plus){
    plusReady();
}else{
    document.addEventListener('plusready',plusReady,false);
}

/**
 * 安卓手机,返回按钮
 */
function backButton() {
    // alert("添加安卓返回监听");
    var back = function () {
        //执行页面返回
        var path =  window.location.hash;
        // alert(path);
        // alert("安卓返回了:"+path);
        if(window.location.hash.indexOf("?")>0){
            window.location.hash.substring(0,window.location.hash.indexOf("?"))
        }
        if("#/"===path){
            //主页,不进行返回,弹出是否返回
            window.plus.nativeUI.confirm( "是否退出应用?", function(e){
                if(e.index==0){
                    window.plus.runtime.quit();
                }
            }, "退出提示", ["退出","先不"] );
        }else{
            //添加按钮返回的回调,用来监听
            // alert("后退");
            // window.history.back();
            if(window.onHardwareBack&&!window.me_hashListen){
                window.onHardwareBack();
            }else{
                // window.history.back();

                var ws=plus.webview.currentWebview();
                plus.webview.close(ws);
            }

            window.history.back();
        }

    }
    window.plus.key.removeEventListener('backbutton',back);
    window.plus.key.addEventListener('backbutton', back, false);
}



function plusReady() {
    //5+准备完毕  原生代码可调用

     plus.navigator.setFullscreen(false);
        plus.navigator.setStatusBarBackground("#000000");// 设置系统状态栏样式为浅色文字
     plus.navigator.setStatusBarStyle( "UIStatusBarStyleBlackOpaque" );

    plus.screen.lockOrientation("portrait");
    var ios = false;
    try{
        var u = navigator.userAgent;
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        ios= !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    }catch (e){
        return true;
    }
    if(ios){
      //  plus.navigator.setFullscreen(true);
    }

    loadJS(true,function () {

        // plus.navigator.setFullscreen(false);
        // plus.navigator.setStatusBarBackground("#0096ff");// 设置系统状态栏样式为浅色文字
        // plus.navigator.setStatusBarStyle( "UIStatusBarStyleBlackOpaque" );
    });


    // alert("装备好:"+this.location.hash);
    backButton();

    //添加返回事件

    // 设置应用全屏显示！
    // plus.navigator.setFullscreen(true);



    // 判断启动方式
    function checkArguments(){
        console.log("plus.runtime.launcher: "+plus.runtime.launcher);
        var args= plus.runtime.arguments;
        if(args){
            // 处理args参数，如打开新页面等
            //处理监听

            var str = decodeURIComponent(args);
            var num = str.indexOf("?{")
            if(num>0){
                str = str.substr(str.indexOf("?") + 1); //取得所有参数   stringvar.substr(start [, length ]
                var json = JSON.parse(str);
                if(json.memo.ResultStatus=="9000"){
                   var query =  getUrlSearch("?"+json.memo.result);
                   if(query.result_code==200){
                       window.schemeInfo = {type:"zfb_login",state:1,value:query.auth_code};
                   }else{
                       window.schemeInfo = {type:"zfb_login",state:0,value:null};
                   }
                }else{
                    window.schemeInfo = {type:"zfb_login",state:0,value:null};
                }
                //登录
            }else{
                var query = getUrlSearch(str);

                if(query["biz_content"]){
                    //人脸返回结果
                    var json = JSON.parse(query.biz_content);

                    if(json&&json.passed){
                        //通过认证
                        window.schemeInfo = {type:"zfb_face",state:1,value:json.biz_no};
                    }else{
                        //没有通过认证
                        window.schemeInfo = {type:"zfb_face",state:0,value:null};
                    }
                }else{
                   // alert("没有读取到验证信息,请联系我们");
                }
            }
            //如果APP没有被重启动
            if(window.schemeListen){
                window.schemeListen(window.schemeInfo);
            }else{
                // window.schemeInfo APP重新启动,验证是否存在/
                // alert("应用重新启动:"+args);
            }
        }
    }
// 处理从后台恢复
    document.addEventListener('newintent',function(){
        console.log("addEventListener: newintent");
        checkArguments();
    },true);
}
// }
var handler = function () {

    // alert("当前URL:"+window.location.hash);

    setTimeout(function () {
        if(window.me_hashListen){
            window.me_hashListen();
        }
        if(window.plus){
            // backButton();
        }
    },200)
};

if (window.attachEvent) {
    window.attachEvent("onhashchange", handler);
} else if (window.addEventListener) {

    window.addEventListener("hashchange", handler, false);
}
//如果存在有APP中,直接加载完成
if(window.plus){
    plusReady();
}else{
    //如果两秒后没有执行加载plusReady,进行直接加载
    if (document.addEventListener) {
        document.addEventListener("plusready", plusReady, false);
    }
    setTimeout(function () {
        if(loadJSSuccess)return;
        loadJS(false,function () {

        });
    },500)
}
// 扩展API加载完毕，现在可以正常调用扩展API

function getUrlSearch(str) {
    var query = {};
    var name, value;
    var num = str.indexOf("?")
    if (num < 0) {
        return query;
    }

    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split("&"); //各个参数放到数组里

    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num)
        }
    }
    return query;
}