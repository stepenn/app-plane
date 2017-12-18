/**
 * Created by lixifeng on 16/12/9.
 */
var wx = require('weixin-js-sdk');
import Toast from '../component/Toast/index.js';
import HttpTool from  "../http/HttpTool.js";
import APIGYW from  "../http/APIGYW.js";
import CookieHelp from  '../tool/CookieHelp.js';

module.exports = {
    is_weixn(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    initWX(){
        if(this.initState){
            return;
        }
        if(!this.is_weixn()){
            Toast.showToast("初始化微信失败,请在微信中打开","black");
            return ;
        }
        log("初始化微信");
        log(wx);

        var wx_appId = CookieHelp.getCookieInfo("wx_appId");
        var wx_timestamp = CookieHelp.getCookieInfo("wx_timestamp");
        var wx_noncestr = CookieHelp.getCookieInfo("wx_noncestr");
        var wx_signature = CookieHelp.getCookieInfo("wx_signature");

        log("wx_appId:"+wx_appId);
        log("wx_timestamp:"+wx_timestamp);
        log("wx_noncestr:"+wx_noncestr);
        log("wx_signature:"+wx_signature);
        if(!wx||!wx_appId||!wx_timestamp||!wx_noncestr||!wx_signature){
            Toast.showToast("初始化微信失败,参数错误","black");
            return;
        }
        wx.config({
            debug: false,
            appId: wx_appId, // 必填，公众号的唯一标识
            timestamp:wx_timestamp, // 必填，生成签名的时间戳，切记时间戳是整数型，别加引号
            nonceStr: wx_noncestr, // 必填，生成签名的随机串
            signature: wx_signature, // 必填，签名，见附录1
            jsApiList: ['checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });
        this.initState = true;
    },
    //获取微信js调用签名
    getWXJsToken(path,callBack){
        var param={
            url:path,
        };
        var successCallback = (code, message, json)=> {
            callBack(code,message,json);
        };
        var failCallback = (code, message)=> {
            callBack(code,message,null);
        };
        HttpTool.post( APIGYW.api_common_getWXJsToken, successCallback, failCallback,param);
    },

};