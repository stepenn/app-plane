/**
 * Created by lixifeng on 16/12/9.
 */
import WXHelp from  './WXHelp.js';
import Toast from  '../component/Toast/index';
module.exports = {
    is_upload(){
        return WXHelp.is_weixn();
    },
    initImage(){
        WXHelp.initWX();
    },
    /**
     *
     * @param imageSize 选择图片的个数q
     * @param callBack(code,msg,paths)
     */
    openImage(imageSize,callBack){
        return WXHelp.openImage(imageSize,callBack);
    },
    getImgPath(callBack){
        if(this.is_upload()){
            this.openImage(1,(code,msg,paths)=>{
                // Loading.show(false);
                if(code==1){
                    callBack(true,paths);
                }else{
                    Toast.showToast(msg,"black");
                    callBack(false,null);
                }

            });
        }else{
            //返回模拟数据
            // var size = Math.round(Math.random()*3);
            // if(size<1)size = 1;
            var size = 1;
            var arr = [];
            for(var i=0;i<size;i++){
                log(window.location);
                arr.push(window.location.origin+"/default/defaultPC.jpeg");
            }
            callBack(true,arr);

        }
    }

};