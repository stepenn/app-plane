/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './SelectImage.css';
import Toast from  "../../Toast/index.js";
class SelectImage extends Component {
    constructor(props) {
        super(props);
        this.savePath = "camera/";
    }


    // 选择照片
    getSelectImage(type ,errorBack) {
        if(!window.plus){
            errorBack({code:-999991,message:"请在APP中打开"});
            return;
        }
        var success = (path)=>{
            var name = path.substr(path.lastIndexOf('/') + 1);
            this.compressImage(path,name);
        };
        var error =  ( e )=> {

        };
        var option = {filename:  "_doc/"+this.savePath,filter:"image"};

        if(type==1){
            //拍照
            plus.camera.getCamera().captureImage(success,error,option)
        }else{
            //从相册中选择图片
            plus.gallery.pick(success,error,option) ;
        }
    }

    //压缩图片
    compressImage(path,filename){
        var name="_doc/"+this.savePath+filename;
        var option = {
            src:path,//src: (String 类型 )压缩转换原始图片的路径
            dst:name,//压缩转换目标图片的路径
            quality:80,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100
            overwrite:true,//overwrite: (Boolean 类型 )覆盖生成新文件
            width:this.props.option.width?this.props.option.width:"100px",
        };

        if(this.props.option){
            for(let i in this.props.option){
                option[i] =  this.props.option[i];
            }
        }
        plus.zip.compressImage(option, (zip)=> {
                //压缩图片
                this.getFileBase64(zip.target);
            }, (error)=> {
                Toast.showToast("选择图片错误,请重新选择 "+error.code);
            });
    }

    // 删除文件(清空所有)
    delFile(){
        var path = this.savePath;
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
    }
    getFileBase64(path) {
        plus.io.resolveLocalFileSystemURL(path, (entry) => {
            entry.file((file) => {
                var fileReader = new plus.io.FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = (e) => {
                    var pathUrl = e.target.result.toString();
                    this.delFile();
                    if (this.props.callBack) {
                        this.props.callBack(true,pathUrl);
                    }
                    if (this.props.onCancel) {
                        this.props.onCancel();
                    }
                }
            }, (e) => {
                Toast.showToast(e.message);
            });
        }, (e) => {
            Toast.showToast("读取拍照文件错误：" + e.message);
        });
    }

    stopClick(e){
        try{
            e.nativeEvent.stopImmediatePropagation()
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble=true
        }catch (error){
        }
    }

    render() {
        return (
            <div className={css.main} onClick={(e)=>{
                if (this.props.callBack) {
                    this.props.callBack(false);
                }
                if (this.props.onCancel) {
                    this.props.onCancel();
                }
            }}>
                {/*{img}*/}
                <div className={css.bottomBg}>
                    <div className={css.camera}
                         onClick={(e) => {
                             this.stopClick(e);
                             this.getSelectImage(1,(error)=>{
                                 if(error.code!=-999992&&error.code!=-999991){
                                     Toast.showToast(JSON.stringify(error));
                                 }else{
                                     //浏览器
                                     if (this.props.callBack) {
                                         this.props.callBack(true,require("../../../main/user/images/logo_icon.png"));
                                     }
                                 }
                             })
                         }}>拍照</div>
                    <div className={css.picture}
                         onClick={(e) => {
                             this.stopClick(e);
                             this.getSelectImage(2,(error)=>{
                                 if(error.code!=-999992&&error.code!=-999991){
                                     Toast.showToast(JSON.stringify(error));
                                 }else{
                                     //浏览器
                                     if (this.props.callBack) {
                                         this.props.callBack(true,require("../../../main/user/images/logo_icon.png"));
                                     }
                                 }
                             })
                         }}>选择相册</div>

                    <div className={css.quit}
                         onClick={(e) => {
                             this.stopClick(e);
                             if (this.props.callBack) {
                                 this.props.callBack(false);
                             }
                             if (this.props.onCancel) {
                                 this.props.onCancel();
                             }
                         }}>取消</div>
                </div>
            </div>
        );
    }
}
module.exports = SelectImage;