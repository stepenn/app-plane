/**
 * Created by apin on 2017/5/26.
 */
import React, {Component} from 'react';
import css from './PersonDetail.less';
import HelpI from '../../help/Help.js';
import ScrollView from  '../../component/ScrollDiv/ScrollDivCom.js';
import Input from '../../component/Dialog/Input/index';
import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Loading from '../../component/Dialog/Loading/index.js';
import Toast from '../../component/Toast/index.js';
import CookieHelp from '../../tool/CookieHelp.js';
import ImageLoad from '../../component/ImageLoad/index.js';

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.user_id = this.Help.app_getParameter(this).friendId;
        this.friendFrom = this.Help.app_getParameter(this).friendFrom;
        this.userInfor = CookieHelp.getUserInfo();
        this.state = {
            upData:0,
        }
        this.img_label = window.imgHost + '/images/bg_label.png';
        this.img_headRing = window.imgHost + '/images/bg_head_ring.png';
        this.img_thumbnail = window.imgHost + '/images/bg_thumbnail.png';
        this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
        this.img_male = window.imgHost + '/images/icon_man.png';
        this.img_female = window.imgHost + '/images/icon_woman.png';
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    animEnter(){
        this.loadNet();
    }

    createSign(tags){
        if (!tags){
            return null;
        }
        var dataSign = tags.split(",");
        var signArr =[];
        for(var i = 0;i<dataSign.length;i++){
            let index = i;
            var signView = (<div key={index} className={css.signContent}>{dataSign[index]}</div>);
            signArr.push(signView);
        }
        return signArr;
    }
    render() {
        var div =null;
        if(!this.userData){
            div = (<div className={css.main}>
                <div className={css.alertCss}>数据加载中,请耐心等待...</div>
            </div>);
        }else {
            var isFriend = (this.user_id!=(this.userInfor?this.userInfor.id:"0"))&&(this.userData.isFriend!=1);
            div = (
                <ScrollView className={css.main}>
                    <div className={css.headLayout}>
                        <div className={css.userline}>
                            <div className={css.userIcon}>
                                <div className={css.imgCon}>
                                    <ImageLoad type={1}
                                               bg={true}
                                               bgStyle={{borderRadius: "50%"}}
                                               src={this.userData.avatar}
                                               error={this.img_defaultAvatar}/>
                                </div>
                                <div className={css.bg} style={{
                                    backgroundImage:this.Help.getImgUrl(this.img_headRing)
                                }}></div>

                            </div>
                            <div className={css.nameLine}>
                                <div className={css.userName}>{this.userData.nick_name}</div>
                                <img className={css.sex} src={this.userData.gender==1?this.img_male:this.img_female}/>
                            </div>

                        </div>

                        <div className={isFriend ? css.addFriendBtn : css.hidden} style={{
                            backgroundImage: this.Help.getImgUrl(this.img_label)
                        }} onClick={()=>{

                            Input.open((v) => { v !== '' ? setTimeout(()=>{this.addFriend(v)},500) : void 0; }, {max:100});

                        }}>加为好友</div>
                        <div className={css.desc}>{this.userData.memo}</div>
                        <div className={css.signArea}>
                            {this.createSign(this.userData.tags)}
                        </div>

                        <div className={css.imgArea}>
                            {this.createImgItem(this.userData.images)}
                        </div>

                    </div>
                </ScrollView>
            );
        }
        return this.Help.app_render(this,div);
    }
//请求详情页数据
    loadNet(){
        if (!this.user_id){
            Toast.showToast("用户id不存在~");
            return;
        }
        var param={
            user_id:this.user_id,
        };
        var successCallback = (code, message, json,option)=> {
            this.userData = json;
            this.upView();
        };
        var failCallback = (code, message)=> {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_getOtherUserInfo, successCallback, failCallback,param);
    }
    addFriend(v){
        var param={
            friendFrom:this.friendFrom,
            friendId:this.user_id,
            friendMobile:this.userData.mobile?this.userData.mobile:"",
            msg:v?v:"",
        };
        Loading.show(true);
        var successCallback = (code, message, json,option)=> {
            Loading.show(false,()=>{
                this.Help.setIntent(1);
                this.Help.back(this);
            });
        };
        var failCallback = (code, message)=> {
            Loading.show(false,()=>{
                Toast.showToast(message);
            });
        };
        HttpTool.post(APIGYW.api_user_addFriend, successCallback, failCallback,param);
    }
    createImgItem(images){
        if (!images){
            return null;
        }
        var imgArr = images.split(",");
        var imgItemArr =[];
        for(var i = 0;i<imgArr.length;i++){
            let index = i;
            let image = imgArr[index];
            var imgView = (
                <div key={index+"imgItem"} className={css.imgItem} onClick={()=>{
                    this.openImage(image);
                }}>
                    <ImageLoad key={index+"ImageLoad"} className={css.imgItemCon}
                               src={image}
                               bg={true}
                               error={this.img_defaultAvatar}>
                    </ImageLoad>
                    <div key={index + "imgItemBg"} className={css.imgItemBg} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_thumbnail)
                    }}></div>
                </div>



            );
            imgItemArr.push(imgView);
        }
        return imgItemArr;
    }
    openImage(imgUrl){
        if(!window.plus){
            Toast.showToast("请在手机上操作");
            return;
        }
        var url  =  window.location.origin+"/plus/camera_image.html";
        var w=plus.webview.create(url,url,
            {hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:"all"});
        w.addEventListener( "loaded", ()=>{
            w.evalJS( "loadMedia('"+imgUrl+"')" );
            //w.evalJS( "loadMedia(\""+"http://localhost:13131/_doc/camera/"+name+"\")" );
        }, false );
        w.addEventListener( "close", ()=> {
            w = null;
        }, false );
        w.show( "pop-in" );
    }

}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;