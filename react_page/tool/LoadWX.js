/**
 * Created by lixifeng on 17/6/17.
 */
import CookieHelp from '../tool/CookieHelp.js';
module.exports = {

     isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
},
    initWXShare(successBack,errorBack){
        if(!this.isWeiXin()){
            errorBack({code:-1,message:"不在微信中"});
            return;
        }
        if(!errorBack){
            errorBack({code:-1,message:"errorBack is null"});
            return;
        }
        if(!successBack){
            errorBack({code:-1,message:"successBack is null"});
            return;
        }
        // http://10.0.0.89:3000/app/?open=%7B%22path%22%3A%22%2FDesireShare%22%2C%22parame%22%3A%7B%22id%22%3A%221ee40310-4fd4-11e7-b48e-7f408a38224a%22%7D%7D&sharetoken=c3b30f691b2e3edb3f3ba71ecbc902749f1c8c49fee1d678288da033b48d97aef4101936052184f9c26e582a8f76647a35423529ec8742b625b3725feaeb9a22#/DesireShare?_k=nwyw62

        //第一步:判断是否存在微信的分享COOKIE
        //第二步:判断URL是否是一个分享URL
        //第三步:替换URL中的sharetoken
        var wxsharetoken = CookieHelp.getCookieInfo("wxsharetoken");

        // var test = {
        //     noncestr: "noncestr",
        //     timestamp: "14000000",
        //     appId: "111",
        //     signature: "aaa",
        //     sharetoken:"adasdasda",
        // };
        // wxsharetoken = encodeURIComponent(JSON.stringify(test))

        if (!wxsharetoken) {
            errorBack({code:-1,message:"没有发现 wxsharetoken Cookie"});
            return;
        }


        var json = null;
        try {
            json = JSON.parse(decodeURIComponent(wxsharetoken));
            // noncestr: noncestr,
            //     timestamp: timestamp,
            //     appId: myconfig.wxAppID,
            //     signature: sha1Encode(encodestr)
            // sharetoken
        } catch (e) {
            errorBack({code:-1,message:"json 解析失败"});
            return;
        }
        if(!json){
            errorBack({code:-1,message:"json is null"});
            return;
        }

        var search = this.getUrlSearch(window.location.href);
        if (!search) {
            errorBack({code:-1,message:"非分享页面 search 不存在"});
            return;
        }
        if (!search.open) {
            errorBack({code:-1,message:"非分享页面 open 不存在"});
            return;
        }
        var link = window.location.origin + window.location.pathname + "?open=" + search.open + "&sharetoken=" + json.sharetoken;

//         主标题：如果你不出去走走，你就会以为这就是世界。
// 副标题：只要半个平米的价格，我们一起拼机去xxx（地）吧。
        var pa = {
            title: "你不出去走走，你就会以为这就是世界", // 分享标题
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            desc:"如果幸福不在路上，那就在路的尽头。",
            imgUrl: window.location.origin+"/images/apinlog.png", // 分享图标
        }
        this.ad("pa:",pa);

        //打开微信分享
        this.setWX(json,pa,successBack,errorBack)

    },
    ad(m,o){
        // alert(m+":"+JSON.stringify(o))
    },
    getUrlSearch(str) {
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
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                query[name] = value;
            }
        }
        return query;
    },
    loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (typeof(callback) != "undefined") {
            if (script.readyState) {
                script.onreadystatechange =  ()=> {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload =  ()=> {
                    callback();
                };
            }
        }
        script.src = url;
        document.body.appendChild(script);
    },
    setWX(config,params,successBack,errorBack){

        if(!config){
            errorBack({code:-62,message:"config is null"});
            return;
        }
        if(!params){
            errorBack({code:-63,message:"params is null"});
            return;
        }
        this.ad("config:",config);
        this.ad("params:",params);
        if(!window.wx){
            if(!this.downWx){
                this.downWx = 0;
            }
            if(this.downWx>5){
                errorBack({code:-7,message:"下载微信JS失败"});
                return;}
            loadScript("http://res.wx.qq.com/open/js/jweixin-1.2.0.js",()=>{
                //下载完成微信JS
                //微信公众号接入文档地址  https://mp.weixin.qq.com/wiki
                this.setWX(config,params,successBack,errorBack)

            });
            return;
        }

        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: config.appId, // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.noncestr, // 必填，生成签名的随机串
            signature: config.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'translateVoice',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard']
        });
            // var config = {
            //     appId: "", // 必填，公众号的唯一标识
            //     timestamp: "", // 必填，生成签名的时间戳
            //     nonceStr: "", // 必填，生成签名的随机串
            //     signature: "",// 必填，签名，见附录1
            // };
            var title = params.title;
            var desc = params.desc;
            var link = params.link;
            var imgUrl = params.imgUrl;
            // var dataUrl = params.dataUrl;
            //  var type = params.type ? params.type : 'link';

            if(!title || !desc || !link || ! imgUrl) {
                errorBack({code:-8,message:"确少参数 在params中"});
                return;
            }

        var shareObj = {
            title: title, // 分享标题
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            desc:desc,
            imgUrl: imgUrl, // 分享图标
            success: ()=>  {
                // 用户确认分享后执行的回调函数
                successBack({code:1,message:"ok"});
            },
            cancel:  ()=> {
                // 用户取消分享后执行的回调函数
                errorBack({code:-9,message:"onMenuShareTimeline"});
            }
        };

        try {
            //分享到朋友
            wx.onMenuShareAppMessage(shareObj);
        } catch (e) {
            errorBack({code:-100,message:e});
        }
        try {
            //分享到朋友圈
            wx.onMenuShareTimeline(shareObj);
        } catch (e) {
            errorBack({code:-101,message:e});
        }
        try {   //分享到QQ
            wx.onMenuShareQQ(shareObj);
        } catch (e) {
            errorBack({code:-102,message:e});
        }
        try { //分享到腾讯微博
            wx.onMenuShareWeibo(shareObj);
        } catch (e) {
            errorBack({code:-103,message:e});
        }
        try {//分享到QQ空间
            wx.onMenuShareQZone(shareObj);
        } catch (e) {
            errorBack({code:-104,message:e});
        }
        try {
            wx.error( (res) =>{
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                errorBack({code:-11,message:res});
            });

        } catch (e) {
            errorBack({code:-13,message:e});
        }


        this.ad("结束语:","代码执行完了")

    }
}