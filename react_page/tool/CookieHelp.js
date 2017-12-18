/**
 * Created by lixifeng on 16/11/4.
 */
import Config from '../Config.js';
let CookieHelp = {


    //获取用户信息
    //获取用户信息

    getUserInfo(){
        if(!this.first||!Config.ISSAP){
            this.getUserInfoMERO();
        }
        this.first = true;
        return this.userinfo;
    },
    getUserInfoMERO(){
        var value  = this.getCookieInfo(this.getUserKey());
        log(value);
        if("none"===value){
            this.userinfo =  null;
        }else{
            this.userinfo =  JSON.parse(value);
        }
    },
    saveUserInfo(userinfo){
        if("none"!=userinfo){
            var json ={
                avatar:userinfo.avatar,
                city_name:userinfo.city_name,
                flag:userinfo.flag,
                gender:userinfo.gender,
                images:userinfo.images,
                memo:userinfo.memo,//个人介绍
                mobile:userinfo.mobile,
                nick_name:userinfo.nick_name,
                tags:userinfo.tags,
                user_name:userinfo.user_name,
                id:userinfo.id,
                ukey:userinfo.ukey,//用户标识
                status:userinfo.status,//领队状态
            };
            this.saveCookieInfo(this.getUserKey(), json)
        }else{
            this.saveCookieInfo(this.getUserKey(), userinfo)
        }
        this.getUserInfoMERO();
        if(this["loginState"]){
            this["loginState"](!("none"===json));
        }
    },
    clearUserInfo(){
        this.saveUserInfo("none");
    },
    //设置

    //获取某个cookie的值
    getCookieInfo(cookiename){
        // alert(cookiename);
        if(document.cookie.length > 0){
            var c_start = document.cookie.indexOf(cookiename+"=");
            if(c_start != -1){
                var cookieStr = document.cookie;
                cookieStr = cookieStr.substring(c_start,cookieStr.length);
                var c_end = cookieStr.indexOf(';');
                c_start = cookiename.length + 1;
                if(c_end == -1){
                    c_end = cookieStr.length;
                }
                var uinfo = cookieStr.substring(c_start,c_end);
                return decodeURI(uinfo);
            }
        }
        return null;
    },
    getUserKey(){
        return "USERINFO";
    },


  saveCookieInfo(key, value){
        // var value = key+'='+encodeURI(JSON.stringify(value))+';path=/';
        // document.cookie = value;
        //
        // userinfo="adsadas;userid=""";ex
        var v = '';
        if(typeof value == "string"){
            v = value;
        }else{
            v= JSON.stringify(value)
        }

        console.log("========")
        console.log(key)
        console.log(value)
        console.log("========")
        var Days = 365;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = key + "="+ encodeURI(v) + ";expires=" + exp.toGMTString()+";path=/";
    },

    //退出登录，清楚cookie
    clearCookie(){
        var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;){
                document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
            }
        }
    }

}
module.exports = CookieHelp;