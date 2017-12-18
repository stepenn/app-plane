/**
 * Created by lixifeng on 17/6/16.
 */
var apin_wx =function (config,params) {

    // var config = {
    //     appId: "", // 必填，公众号的唯一标识
    //     timestamp: "", // 必填，生成签名的时间戳
    //     nonceStr: "", // 必填，生成签名的随机串
    //     signature: "",// 必填，签名，见附录1
    // };
    var title = params.title;
    var desc = params.desc;
    var link = params.link;
    var type = params.type ? params.type : 'link';
    var imgUrl = params.imgUrl;
    var dataUrl = params.dataUrl;

    if(!title || !desc || !link || ! imgUrl) return ;

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

    function shareSuccess(type) {
        alert('success   '+type);
    }

    function shareError(type) {
        alert('error    ' + type);
    }

    loadScript("http://res.wx.qq.com/open/js/jweixin-1.2.0.js",function(){
        //下载完成微信JS
        //微信公众号接入文档地址  https://mp.weixin.qq.com/wiki

        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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

        wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
            // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
            // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
            // 则可以直接调用，不需要放在ready函数中。

            //分享给朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                type: type, // 分享类型,music、video或link，不填默认为link
                dataUrl: dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareSuccess('onMenuShareAppMessage');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareError('onMenuShareAppMessage');
                }
            });
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareSuccess('onMenuShareTimeline');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareError('onMenuShareTimeline');
                }
            });
            //分享到QQ
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareSuccess('onMenuShareQQ');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareError('onMenuShareQQ');
                }
            });
            //分享到腾讯微博
            wx.onMenuShareWeibo({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareSuccess('onMenuShareWeibo');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareError('onMenuShareWeibo');
                }
            });
            //分享到QQ空间
            wx.onMenuShareQZone({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareSuccess('onMenuShareQZone');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    shareError('onMenuShareQZone');
                }
            });


        });
        wx.error(function (res) {
            console.log(res);
            alert(res);
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });



    });
}
apin_wx();