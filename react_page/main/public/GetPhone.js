/**
 * Created by apin on 2017/6/8.
 */
import APILXF from '../../http/APILXF';
import HttpTool from '../../http/HttpTool.js';
module.exports = {
    openSelect(myOption,successBack,errorBack){
        if(window.plus){
            var list = [];
            // 更新分享列表

            list.push({title: '拍照', id: '1'});
            list.push({title: '相册', id: '2',});
            plus.nativeUI.actionSheet(
                {title: '选择图片', cancel: '取消', buttons: list}
                ,  (e) =>{
                    if(e.index>0){
                        var obj = list[e.index - 1];
                        this.getSelectImage(obj.id,myOption,successBack,errorBack);
                    }else{
                        errorBack({code:-999992,message:"取消操作"});
                    }

                });
        }else{
            //errorBack({code:-999991,message:"请在APP中打开"});
            //浏览器,选择图片方案

            //浏览器
            var url  =  window.location.origin+"/images/apinlog.png";
            successBack(url);
        }
    },
    // 选择照片
    getSelectImage(type,myOption,successBack,errorBack) {
        if(!window.plus){
            errorBack({code:-999991,message:"请在APP中打开"});

            return;
        }

        var success = (path)=>{
            var name = path.substr(path.lastIndexOf('/') + 1);
            this.compressImage(path,name,myOption,successBack,errorBack);
        };
        var error =  ( e )=> {
            errorBack(e);
            //用户取消,不处理
        };
        var option = {filename:  "_doc/"+myOption.savePath,filter:"image"};

        if(type==1){
            //拍照
            plus.camera.getCamera().captureImage(success,error,option)
        }else{
            //从相册中选择图片
            plus.gallery.pick(success,error,option) ;
        }
    },

    /**
     * 压缩图片
     * @param path
     * @param filename
     * @param successBack
     * @param errorBack
     */
    compressImage(path,filename,myOption,successBack,errorBack){
        var name="_doc/"+myOption.savePath+filename;
        var option = {
            src:path,//src: (String 类型 )压缩转换原始图片的路径
            dst:name,//压缩转换目标图片的路径
            quality:75,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100
            overwrite:true,//overwrite: (Boolean 类型 )覆盖生成新文件
            width:480,
        };

        if(myOption){
            for(let i in myOption){
                option[i] =  myOption[i];
            }
        }
        plus.zip.compressImage(option, (zip)=> {
            //压缩图片
            this.getFileBase64(zip.target,myOption,successBack,errorBack);
        }, (error)=> {
            errorBack(error);
        });
    },

    // 删除文件(清空所有)
    delFile(myOption){
        var path = myOption.savePath;
        plus.io.resolveLocalFileSystemURL( "_doc/",  ( entry ) =>{
            entry.getDirectory( path, {create:true},  ( dir )=> {
                dir.removeRecursively(  () =>{
                    // Success
                    //super.showToast( "删除成功！" );
                }, ( e )=> {
                    //super.showToast( "删除失败："+e.message );
                });
            }, ( e ) =>{
                //super.showToast("Get directory \"audio\" failed: "+e.message);
            } );
        },  ( e )=> {
            //super.showToast( "Resolve \"_doc/\" failed: "+e.message );
        } );
    },

    /**
     * 转换本机图片为base64
     * @param path
     * @param successBack
     * @param errorBack
     */
    getFileBase64(path,myOption,successBack,errorBack) {
        plus.io.resolveLocalFileSystemURL(path, (entry) => {
            entry.file((file) => {
                var fileReader = new plus.io.FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = (e) => {
                    var base64 = e.target.result.toString();
                    this.delFile(myOption);
                    this.commitImg(base64,successBack,errorBack)
                }
            }, (e) => {
                errorBack(e);
            });
        }, (e) => {
            errorBack(e);
        });
    },

    /**
     * 上传图片到服务器
     * @param base64
     * @param successBack
     * @param errorBack
     */
    commitImg(base64,successBack,errorBack){
        var param={
            image:base64,
        }
        var successCallback = (code, message, json, option) => {
            successBack(json);
        };
        var failCallback = (code, message) => {
            errorBack({code:code,message:message});
        };
        HttpTool.post(APILXF.api_common_uploadImage, successCallback, failCallback, param);
    }

}