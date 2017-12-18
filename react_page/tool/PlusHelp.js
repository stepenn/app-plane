/**
 * Created by lixifeng on 17/4/26.
 */


module.exports = {
    getUserDefault(key)
    {
        if(typeof key != 'undefined' && typeof key === "string")
        {
            var UserDefaultsClass = plus.ios.importClass("NSUserDefaults");
            var standardUserDefaults = UserDefaultsClass.standardUserDefaults();
            var v =  plus.ios.invoke(standardUserDefaults, "objectForKey:", key);
            this.SetUserDefault(key,null);
            return v;
        }
        return null;
    },
// 在HTML页面中调用如下代码实现数据的保存
    SetUserDefault(key, value)
    {
        if (typeof value != 'undefined' && typeof key === "string")
        {
            var UserDefaultsClass = plus.ios.importClass("NSUserDefaults");
            var standardUserDefaults = UserDefaultsClass.standardUserDefaults();
            plus.ios.invoke(standardUserDefaults, "setObject:forKey:", value, key);
            plus.ios.invoke(standardUserDefaults,"synchronize");
        }
    },

    //压缩图片
    compressImage(path,callBack,option){
        var savePath = "temp/";
        var name = path.substr(path.lastIndexOf('/') + 1);
        var optionPar = {
            src:"file://"+path,
            dst:"_doc/"+savePath+name,
            overwrite:true,
            quality:50
        };
        if(option){
            for(let i in option){
                optionPar[i] =  option[i];
            }
        }
        plus.zip.compressImage(optionPar,
            (event)=> {
                //event.target;  压缩转换后的图片url路径，以"file://"开头
                var target = event.target; // 压缩转换后的图片url路径，以"file://"开头
                // var size = event.size; // 压缩转换后图片的大小，单位为字节（Byte）
                // var width = event.width; // 压缩转换后图片的实际宽度，单位为px
                // var height = event.height; // 压缩转换后图片的实际高度，单位为px
                this.getFileBase64(savePath,target,(state,msg)=>{
                    if(state){
                        if (callBack) {
                            callBack(true,
                                {
                                    code:1,
                                    message:"转换BASE64成功",
                                    base64:msg,
                                    base64Size:msg.length,
                                    size:event.size,
                                    width : event.width,
                                    height : event.height
                                }
                                );
                        }
                    }else{
                        if (callBack) {
                            callBack(false,{code:-1,message:msg});
                        }
                    }
                });
            }, (error)=> {
                if (callBack) {
                    callBack(false,error);
                }
            });
    },

    getFileBase64(savePath,path,callBack) {
        plus.io.resolveLocalFileSystemURL(path, (entry) => {
            entry.file((file) => {
                var fileReader = new plus.io.FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = (e) => {
                    let pathUrl = e.target.result.toString();
                    this.delFile(savePath,()=>{
                        if (callBack) {
                            callBack(true,pathUrl);
                        }
                    });


                }
            }, (e) => {
                if (callBack) {
                    callBack(false,e.message);
                }
            });
        }, (e) => {
            if (callBack) {
                callBack(false,e.message);
            }
        });

    },
    // 删除文件(清空所有)
    delFile(savePath,callBack){
        plus.io.resolveLocalFileSystemURL( "_doc/",  ( entry ) =>{
            entry.getDirectory( savePath, {create:true},  ( dir )=> {
                dir.removeRecursively(  () =>{
                    // Success
                    //super.showToast( "删除成功！" );
                    if(callBack){
                        callBack();
                    }
                }, ( e )=> {
                    if(callBack){
                        callBack(e);
                    }
                    //super.showToast( "删除失败："+e.message );
                });
            }, ( e ) =>{
                if(callBack){
                    callBack(e);
                }
                //super.showToast("Get directory \"audio\" failed: "+e.message);
            } );
        },  ( e )=> {
            if(callBack){
                callBack(e);
            }
            //super.showToast( "Resolve \"_doc/\" failed: "+e.message );
        } );
    }
}
