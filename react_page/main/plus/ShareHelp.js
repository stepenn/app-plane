/**
 * Created by lixifeng on 17/5/25.
 */
module.exports = {

    /**
     *
     * @param successBack
     * @param errorBack
     * @param option
     * // String content; 分享内容
     // String[] thumbs 分享缩略图
     // String[] pictures; 分享图片
     // String href; 分享链接
     // String title; 分享标题
     // JSON extra; 分享消息扩展参数
     // GEOPosition geo; 分享定位
     // ShareMessageExtra extra; 分享消息扩展参数
     // String interface; 分享消息的模式
     // 可取值： "auto" - 自动选择，如果已经安装微博客户端则采用编辑界面进行分享，否则采用无界面分享； "slient" - 静默分享，采用无界面模式进行分享； "editable" - 进入编辑界面，用户确认分享内容后发送，如果当前未安装微博客户端则触发错误回调。 默认值为"auto"。 （仅新浪微博分享时生效）
     */
    // var msg = {
    //     title:"你好0",
    //     content: "Hello",
    //     href: "http://www.apin.com",
    // };

    openShare(successBack,errorBack,option,type){
        this.shareShow((e)=>{
            if(successBack){
                successBack(e);
            }
        },(e)=>{
            if(errorBack){
                errorBack(e);
            }
        },option,type);
    },



    /**
     *  打开分享
     */
    shareShow(successBack,errorBack,option,type) {
        if(!option){
            errorBack({code:-999990,message:'option 参数为必选!'});
        }

        if(!option.thumbs){
            option.thumbs = [window.location.origin+"/images/apinlog.png"]
        }



        if(window.plus){
            //QQ/WECHAR(微信朋友圈)/WEUSER(微信朋友)/WEIBO
            if(type){
                var obj = {};
                if(type=="WEUSER"){
                    obj = {title: '微信好友',desc:"微信", id: 'weixin', x: 'WXSceneSession'};
                }else if(type=="WEIBO"){
                    obj ={title: '新浪微博', desc:"新浪微博",id: 'sinaweibo',x:""};
                }else if(type=="QQ"){
                    obj = {title: 'QQ',desc:"QQ", id: 'qq',x:""};
                }else if(type=="WECHAR"){
                    obj = {title: '微信朋友圈', desc:"微信",id: 'weixin', x: 'WXSceneTimeline'};
                }else{
                    errorBack({code:-999992,message:'type 不匹配'});
                    return;
                }
                this.getShareList(obj,successBack,errorBack,option);
            }else{
                var shareBts = [];
                // 更新分享列表
                shareBts.push({title: '微信朋友圈', id: 'weixin', x: 'WXSceneTimeline'});
                shareBts.push({title: '微信好友', id: 'weixin', x: 'WXSceneSession'});
                shareBts.push({title: '新浪微博', id: 'sinaweibo',x:""});
                shareBts.push({title: 'QQ', id: 'qq',x:""})
                plus.nativeUI.actionSheet(
                    {title: '分享', cancel: '取消', buttons: shareBts}
                    ,  (e) =>{
                        if(e.index>0){
                            var obj = shareBts[e.index - 1];
                            this.getShareList(obj,successBack,errorBack,option);
                        }

                    });
            }

        }else{
            errorBack({code:-999991,message:'请在APP中打开!'});
        }
    },

    getShareList(sb,successBack,errorBack,option){
        // 扩展API加载完毕，现在可以正常调用扩展API
        plus.share.getServices( (s)=>{
            var toShare = null;
            for(let i in s){
                var sha = s[i];
                if( sb.id == sha.id){
                    //存在此分离
                    toShare = sha;
                    toShare.x = sb.x;
                }
            }
            // 发送分享
            if(toShare){
                if(toShare.nativeClient){
                    if ( toShare.authenticated) {
                        this.shareMessage(toShare,successBack,errorBack,option);
                    } else {
                        toShare.authorize( ()=>{
                            this.shareMessage(toShare,successBack,errorBack,option);
                        },(e)=>{
                            errorBack(e);
                        });
                    }
                }else{
                    errorBack({code:-999992,message:"未安装"+sb.desc+"客户端!"});
                }

            }else{
                errorBack({code:-999992,message:"无"+sb.title+"分享服务!"});
            }


        }, (e)=>{
            errorBack(e);
        } );
    },
    /**
     * 发送分享消息
     * @param {plus.share.ShareService} s
     */
    shareMessage(s,successBack,errorBack,option) {

        option.extra = {scene: s.x};
        s.send(option, () => {
            successBack("ok");
        }, (e) => {
            errorBack(e);
        });
    }
}