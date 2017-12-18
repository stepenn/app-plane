/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
import ScrollDivCom from '../../component/ScrollDiv/ScrollDivCom';
/**
 * 测试图片上传的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state = {
            message:"",
            progress:0,
            upData:0,
        }
        var imgHost = "";
        if(window.plus){
            imgHost = "http://localhost:13131/_doc/res";
        }
        this.imgSrc = imgHost+"/images/plane.png";

    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        });
    }
    openFile(){
        if(!window.plus){
            return;
        }
        var host = window.location.origin;
        var url  = host+"/plus/file.html";
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
    showMessage(message,progress){
        this.setState({
            message:this.state.message+"\r\n"+message,
            progress:progress?progress:this.state.progress,
        });
    }

    render() {
        var div = (
            <ScrollDivCom style={{widht:"100%",height:"100%",padding:"0.2rem", boxSizing: "border-box"}}>
                <div style={{padding:30}}>
                    <div>这是图片加载页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>
                </div>

                <div
                    onClick={()=>{
                        this.openFile();
                    }}
                >打开文件系统</div>
                <div
                    onClick={()=>{
                        this.setState({
                            message:"",
                            progress:0,
                        });

                        var host = "http://10.0.0.89:3000";
                        var down = host + "/upData/img.zip";
                        this.createDownload(down);
                    }}
                >开始下载</div>
                <div>{this.state.progress+"%"}</div>
                <div>{this.state.message}</div>
                <div

                    onClick={()=>{
                        this.setImgFromLocal("_doc/res/img/a.png");
                    }}
                >{"测试显示本地图片"}</div>
                <img  ref="testImg"  style={{width:"2rem",height:"2rem",backgroundColor:"#ff00ff"}} src={this.imgSrc}/>


            </ScrollDivCom>
        );
        return this.Help.app_render(this,div,{full:false});
    }
     setImgFromLocal(relativePath) {
//平台转对象
         plus.io.resolveLocalFileSystemURL(relativePath, (entry)=> {
//对象转网络
             this.imgSrc = entry.toRemoteURL();
             alert( this.imgSrc);
             this.refs.testImg.src = this.imgSrc;
             // this.upView();
         },  ( e )=>{
             alert( "Resolve file URL failed: "+e.code+" msg:" + e.message );
         } );
}
//解压缩
    zipDecompress(zipfile) {
    var targetPath = '_www/img/';
    alert(plus.io.PRIVATE_WWW);
    plus.zip.decompress(zipfile, targetPath,
        () =>{
            alert("Decompress success!");
        },(error) =>{
            alert(JSON.stringify(error));
        });
}
    // 创建下载任务
     createDownload(url) {
    this.showMessage(url)
    var options = {method:"GET"};
    var dtask = plus.downloader.createDownload( url, options );

    dtask.addEventListener( "statechanged", (task,status)=>{
        if(!dtask){return;}
        switch(task.state) {
            case 1: // 开始
                this.showMessage( "开始下载..." );
                break;
            case 2: // 已连接到服务器
                this.showMessage( "链接到服务器..." );
                break;
            case 3:	// 已接收到数据

                var persent = (Math.ceil((task.downloadedSize/task.totalSize)*100))
                if(persent>=100){
                    persent = 100;
                }
                this.showMessage( "下载更新数据..." +persent+"%",persent);
                break;
            case 4:	// 下载完成
                this.showMessage( "下载完成！" +JSON.stringify(task));
            alert(task.filename);
            this.zipDecompress(task.filename);
                //提示信息转按钮
                break;
            default:
                this.showMessage("下载状态:"+status );

        }
    },false );
    dtask.start();
}
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;