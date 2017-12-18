/**
 * Created by lixifeng on 17/5/25.
 */
import Toast from '../../component/Toast/index.js';
import CheckInstallApk from "../../tool/CheckInstallApk.js";
module.exports = {
    /**
     * 打开第三方登录 (包含页面)
     */
    openLogin(obj, successBack,errorBack){
        this.loginShow(obj, (e)=>{
            // alert(JSON.stringify(e));
            if(successBack){
                successBack(JSON.stringify(e));
            }
        },(e)=>{
            if(errorBack){
                errorBack(e);
            }
            Toast.showToast(e.message);
        });
    },

    loginShow(obj,successBack,errorBack) {
        // var loginBts = [];
        // // 更新分享列表
        // loginBts.push({title: '微信登录', id: 'weixin'});
        // loginBts.push({title: '新浪登录', id: 'sinaweibo'});
        // loginBts.push({title: 'QQ登录', id: 'qq'})

        if(window.plus){
            this.getLoginList(obj,successBack,errorBack);
            // plus.nativeUI.actionSheet(
            //     {title: '第三方登录', cancel: '取消', buttons: loginBts}
            //     ,  (e) =>{
            //         if(e.index>0){
            //             var obj = loginBts[e.index - 1];
            //             this.getLoginList(obj,successBack,errorBack);
            //         }
            //     });
        }else{
            errorBack({code:-999991,message:'请在APP中打开!'});
        }

    },
    getLoginList(sb,successBack,errorBack){
        // 扩展API加载完毕，现在可以正常调用扩展API
        if(!CheckInstallApk.checkInstallApk(sb.installType)){
            Toast.showToast("您未安装"+sb.alertTitle);
        }else {
            plus.oauth.getServices((s)=>{
                var toLogin = null;
                for(let i in s){
                    var log = s[i];
                    if( sb.id == log.id){
                        //存在此登录
                        toLogin = log;
                    }
                }
                // 去登录
                if(toLogin){
                    toLogin.logout((e)=>{
                        this.authLogin(toLogin,successBack,errorBack);
                    }, (e)=>{
                        this.authLogin(toLogin,successBack,errorBack);
                    });

                }else{
                    errorBack({code:-999992,message:"无"+sb.title+"登录服务!"});
                }
            }, (e)=>{
                errorBack(e);
            } );
        }
    },
// 登录操作
    authLogin(s,successBack,errorBack) {
        s.login((e) => {
            if(e.userInfo){
                successBack(e);
            }else{
                // Toast.showToast("登录认证成功！未获取到用户信息");
                this.authUserInfo(s,successBack,errorBack);
            }
        }, (e) => {
            // errorBack(e);
            errorBack({code:-999994,message:"登录认证失败!"});
            // Toast.showToast("登录认证失败！"+e.code+" msg:"+e.message);
        });

    },
    // 获取登录用户信息操作
    authUserInfo(s,successBack,errorBack){
        if ( !s.authResult ) {
            errorBack({code:-999993,message:"未登录授权!"});
        } else {
            s.getUserInfo( (e)=>{
                successBack(e);
            },  (e)=>{
                errorBack(e);
            } );
        }
    },

}