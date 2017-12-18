/**
 * Created by lixifeng on 17/5/29.
 */
import React, {Component} from 'react';
import css from './index.less';
import Toast from '../../../component/Toast/index.js';
import ImageLoad from '../../../component/ImageLoad/index.js';
import APILXF from '../../../http/APILXF';
import HttpTool from '../../../http/HttpTool.js';
import ClickHelp from '../../../tool/ClickHelp.js';

/**
 * option :图片读取参数
 * successListen={(url)=>{alert("url:"+url)}}
 * clearListen={()=>{alert("回归到无图片状态 ");}}
 * src:default image
 * viewStyle: 1 默认选择 2：圆选择 没有del
 */
class index extends Component{
    constructor(props){
        super(props);
        this.viewStyle = 1;

        if(this.props.viewStyle){
            this.viewStyle = this.props.viewStyle;
        }
        this.savePath = "selectImg/";

        this.img_default = window.imgHost + ("/images/img_addImg.png");
        this.img_add = this.img_default;
        if(this.props.src){
            this.img_add = this.props.src;
        }
        this.img_del = window.imgHost + ("/images/delete_icon.png");


        if(this.viewStyle==1){
            this.img_bg = window.imgHost + ("/images/bg_thumbnail.png");

        }else{
            this.img_bg = window.imgHost + ("/images/bg_head_ring.png");
        }


        //0:默认状态  1:选择图片中 2:下载图片中 3:下载图片失败 4:下载图片成功
        this.state = {
            progress:this.props.src?2:0,
        }


    }
    setProgress(progress){
        this.setState({
            progress:progress
        });
    }

    clear(){
        this.img_add = this.img_default;
        this.setProgress(0);
        if(this.props.clearListen){
            this.props.clearListen();
        }
    }
    openImage(){
       if(!window.plus){
           return;
       }
        var url  =  window.location.origin+"/plus/camera_image.html";
        var w=plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:"all"});
        w.addEventListener( "loaded", ()=>{
            w.evalJS( "loadMedia('"+this.img_add+"')" );
            //w.evalJS( "loadMedia(\""+"http://localhost:13131/_doc/camera/"+name+"\")" );
        }, false );
        w.addEventListener( "close", ()=> {
            w = null;
        }, false );
        w.show( "pop-in" );
    }

    render(){
        if(this.viewStyle==1){
            return this.renderAdd();
        }else{
            return this.renderCircle();
        }
    }
    renderCircle(){
        var success_div = null;
       if(this.state.progress==1){
            //上传中
            success_div = <div className={css.frame}>
                <div className={css.loadCenter}>
                    <div className={css.ballBeat}/>
                    <div className={css.ballBeat2}/>
                    <div className={css.ballBeat3}/>
                </div>
            </div>
        }else  if(this.state.progress>1){
            success_div = (
                <div>
                    <div className={css.img} style={{backgroundImage:"url("+this.img_bg+")"}}></div>
                    <div className={css.imgSuccess}>
                        <ImageLoad bgStyle={{borderRadius:"50%"}} src={this.img_add} bg={true} />
                    </div>


                </div>
            );
        }else{
           success_div = (
               <div>
                   <div className={css.img} style={{backgroundImage:"url("+this.img_bg+")"}}></div>

               </div>
           );
       }
        return(
            <div
                onClick={()=>{
                    this.setProgress(1);

                    //真机时调用
                    this.openSelect((url)=>{
                        this.addImage(url)
                    },(error)=>{

                        this.setProgress(2);
                        if(error.code!=-999992&&error.code!=-999991){
                            //Toast.showToast(JSON.stringify(error));
                        }else{

                        }

                    });

                }}
            >
                <div

                    className={css.img}>

                    {success_div}
                </div>

            </div>
        );
    }
    renderAdd(){

        var success_div = null;
        if(this.state.progress>1){
            success_div = (
                <div>
                    <div className={css.imgSuccess}>
                        <ImageLoad src={this.img_add} bg={true} />
                    </div>
                    <div className={css.img} style={{backgroundImage:"url("+this.img_bg+")"}}></div>
                    <div className={css.close} style={{backgroundImage:"url("+this.img_del+")"}}
                         onClick={(e)=>{
                             ClickHelp.stopClick(e);

                             this.clear();
                         }}
                    ></div>
                </div>
            );
        }else if(this.state.progress==1){
            //上传中
            success_div = <div className={css.frame}>
                <div className={css.loadCenter}>
                    <div className={css.ballBeat}/>
                    <div className={css.ballBeat2}/>
                    <div className={css.ballBeat3}/>
                </div>
            </div>
        }else{
            success_div = <ImageLoad src={this.img_add} bg={true} />;
        }
        return(
               <div
                   onClick={()=>{
                       if(this.state.progress>1){
                           this.openImage();
                       }else {
                           this.setProgress(1);


                           //真机时调用
                           this.openSelect((url)=>{
                               this.addImage(url)
                           },(error)=>{
                           this.setProgress(0);
                           if(error.code!=-999992&&error.code!=-999991){
                               //Toast.showToast(JSON.stringify(error));
                           }else{

                           }

                           });
                       }

                   }}
               >
                   <div

                       className={css.img}>

                       {success_div}
                   </div>

               </div>
        );
    }
    addImage(url){
        this.img_add = url;
        this.setProgress(2);
        if(this.props.successListen){
            this.props.successListen(url);
        }
    }
    openSelect(successBack,errorBack){
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
                        this.getSelectImage(obj.id,successBack,errorBack);
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
    }
    // 选择照片
    getSelectImage(type,successBack,errorBack) {
        if(!window.plus){
            errorBack({code:-999991,message:"请在APP中打开"});

            return;
        }
        var success = (path)=>{
            var name = path.substr(path.lastIndexOf('/') + 1);
            this.compressImage(path,name,successBack,errorBack);
        };
        var error =  ( e )=> {
            errorBack(e);
            //用户取消,不处理
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

    /**
     * 压缩图片
     * @param path
     * @param filename
     * @param successBack
     * @param errorBack
     */
    compressImage(path,filename,successBack,errorBack){
        var name="_doc/"+this.savePath+filename;
        var option = {
            src:path,//src: (String 类型 )压缩转换原始图片的路径
            dst:name,//压缩转换目标图片的路径
            quality:75,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100
            overwrite:true,//overwrite: (Boolean 类型 )覆盖生成新文件
            width:480,
        };

        if(this.props.option){
            for(let i in this.props.option){
                option[i] =  this.props.option[i];
            }
        }
        plus.zip.compressImage(option, (zip)=> {
            //压缩图片
            this.getFileBase64(zip.target,successBack,errorBack);
        }, (error)=> {
            errorBack(error);
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

    /**
     * 转换本机图片为base64
     * @param path
     * @param successBack
     * @param errorBack
     */
    getFileBase64(path,successBack,errorBack) {
        plus.io.resolveLocalFileSystemURL(path, (entry) => {
            entry.file((file) => {
                var fileReader = new plus.io.FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = (e) => {
                    var base64 = e.target.result.toString();
                    this.delFile();
                    this.commitImg(base64,successBack,errorBack)
                }
            }, (e) => {
                errorBack(e);
            });
        }, (e) => {
            errorBack(e);
        });
    }

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
module.exports = index;