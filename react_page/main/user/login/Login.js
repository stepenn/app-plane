/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import css from './Login.less';
import HelpI from '../../../help/Help.js';
import InputCellNew from '../../../tool/InputRow/InputCellNew.js';
import Toast from '../../../component/Toast/index.js';
import HttpTool from '../../../http/HttpTool.js';
import APILXF from '../../../http/APILXF.js';
import APIGYW from '../../../http/APIGYW.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import ScrollView from  '../../../component/ScrollDiv/ScrollDivCom.js';
import CookieHelp from '../../../tool/CookieHelp.js';
import ClickHelp from '../../../tool/ClickHelp.js';
import LoginHelp from '../../plus/LoginHelp.js';
import HelpBindDevice from '../../../tool/HelpBindDevice.js';


class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        // this.img_userIcon = require("../images/userIcon.png");
        this.img_userIcon = window.imgHost + ("/images/icon_user.png");
        this.img_pwIcon = window.imgHost + ("/images/icon_lock.png");
        this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.icon_selected = window.imgHost + '/images/icon_top.png';
        this.img_tick = window.imgHost + '/images/img_tick.png';
        this.img_qq = window.imgHost + '/images/img_qq.png';
        this.img_wechat = window.imgHost + '/images/img_wechat.png';
        this.img_sina = window.imgHost + '/images/img_weibo.png';
        this.state = {
            isPWlogin:true,
        }
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    getShowData() {
        var dataS = [];
        dataS.push({
            name: "mobile",
            title: "用户名",
            hint: "请输入手机号",
            type: "number",
            reg: /^[\S]{2,11}$/,
            regTitle: "11位数字",
            icon:this.img_userIcon
        });
        dataS.push({
            name: "password",
            title: "密码",
            hint: "请输入您的密码",
            type: "password",
            reg: /^[\S]{8,16}$/,
            regTitle: "8—16位的字母数字组合(不支持特殊字符)",
            icon:this.img_pwIcon,
        });
        return dataS;
    }
    getShowView(){
        if(this.showViewTypeLeft){
            return this.showViewTypeLeft;
        }

        if(!this.dataS){
            this.dataS = this.getShowData();
        }

        let size = this.dataS.length;
        var viewS = [];
        for(var i=0;i<size;i++){
            viewS.push(this.getShowRow(this.dataS[i],i));
        }
        return this.showViewTypeLeft  = viewS;
    }

    getShowData_right() {
        var dataS = [];
        dataS.push({
            name: "mobile",
            title: "用户名",
            hint: "请输入手机号",
            type: "number",
            reg: /^[\S]{2,11}$/,
            regTitle: "11位数字",
            icon:this.img_userIcon
        });
        dataS.push({
            name:"verificationCode",
            title:"验证码",
            hint:"请输入验证码",
            type:"number",
            reg:/^\d{6}$/,
            regTitle:"6位数字",
            viewSend:true,
            icon:this.img_pwIcon,
            sendCallBack:(clearSendMsg,autoTime)=>{
                //执行发送验证码
                this.sendSMS(clearSendMsg,autoTime);
            }
        });
        return dataS;
    }
    getShowView_right(){
        if(this.showViewType_right){
            return this.showViewType_right;
        }

        if(!this.dataS_right){
            this.dataS_right = this.getShowData_right();
        }

        let size = this.dataS_right.length;
        var viewS = [];
        for(var i=0;i<size;i++){
            viewS.push(this.getShowRow(this.dataS_right[i],i));
        }
        return this.showViewType_right  = viewS;
    }

    getShowRow(data,i){
        return (
            <InputCellNew ref={i} data={data} key={"input"+i}
                       getObject={(obj)=>{
                           if (this.state.isPWlogin){
                               if(!this.inputList){
                                   this.inputList =[]
                               }
                               obj.data = data;
                               this.inputList.push(obj);
                           }else {
                               if(!this.inputList_right){
                                   this.inputList_right =[]
                               }
                               obj.data = data;
                               this.inputList_right.push(obj);
                           }

                       }}
            />
        );
    }


    clickLogin() {
        //获取真实值
        var realinputList = this.state.isPWlogin?this.inputList:this.inputList_right;
        var realdataS = this.state.isPWlogin?this.dataS:this.dataS_right;
        for(var i in realinputList){
            realinputList[i].getValue(realdataS[i]);
        }

        var size = realdataS.length;
        var param = {};
        for(var i=0;i<size;i++){
            let d = realdataS[i];
            if(d.type=="password"){
                if(!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(d.value))){
                    Toast.showToast(d.hint+" ("+d.regTitle+")")
                    return;
                }
            }
            if(!d.reg_state){
                Toast.showToast(d.hint+" ("+d.regTitle+")")
                return;
            }
            param[d.name] = d.value;
        }
        param.loginType = this.state.isPWlogin?0:1;

        Loading.show(true);
        //参数
        var successCallback = (code, message, json, option) => {
            Loading.show(false,()=>{
                CookieHelp.saveUserInfo(json);
                this.bindDevice();
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false,()=>{
                Toast.showToast(message)
            });
        };
         HttpTool.post(APILXF.api_user_accountLogin, successCallback, failCallback, param);
    }
//发送验证码
    sendSMS(clearSendMsg,autoTime) {
        //获取手机号字段
        var data = this.dataS_right[0];//手机号
        if (!data.reg_state) {
            this.showToast(data.hint+" ("+data.regTitle+")");
            return;
        }
        autoTime();
        //参数
        var param = {
            mobile: data.value,
            codeType:1,
        };
        var successCallback = (code, message, json, option) => {
            if (code == 1) {
                Toast.showToast("发送成功");
            } else {
                clearSendMsg();
                Toast.showToast(message);
            }
        };
        var failCallback = (code, message) => {
            clearSendMsg();
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_accountGetcode, successCallback, failCallback, param);
    }

    render() {
        var inputArea=null;
        if (this.state.isPWlogin){
            inputArea = this.getShowView();
        }else {
            inputArea = this.getShowView_right();
        }

        var div = (
            <ScrollView className={css.main}>
                <div className={css.img}>
                    <div className={css.imgCon} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_defaultAvatar)
                    }}></div>
                </div>
                <div className={css.leftTilie}
                     {...ClickHelp.onClick(()=>{

                         this.setState({
                             isPWlogin:true,
                         })
                     })}

                >账号密码登录</div>
                <div className={css.rightTilie}

                     {...ClickHelp.onClick(()=>{

                         this.setState({
                             isPWlogin:false,
                         })
                     })}



                >验证码登录</div>
                <div className={css.clear}></div>
                <img className={this.state.isPWlogin?css.sign:css.refSign} src={this.icon_selected}/>
                <div className={css.whiteBg}>
                    {inputArea}
                    <div className={css.forgetPw}
                         {...ClickHelp.onClick(()=>{
                             this.Help.app_open(this, "/Regist", {
                                 title:"忘记密码",
                                 isForgetPW: true,
                                 callBack:()=>{
                                     this.bindDevice();
                                 }
                             });
                         })}
                        >
                        忘记密码?
                    </div>

                    <div className={css.submit} style={{
                        backgroundImage:this.Help.getImgUrl(this.img_submit)
                    }}
                         {...ClickHelp.onClick(()=>{

                             this.clickLogin();
                         })}

                    >登录</div>
                </div>
                <div className={css.bottomTitleLayout}>
                    <div className={css.bottomTitleLine}></div>
                    <div className={css.bottomTitle}>快捷登录</div>
                    <div className={css.bottomTitleLine}></div>
                </div>

                <div className={css.libLayout}>
                    {this.createSanFang()}
                </div>
            </ScrollView>
        );

        return this.Help.app_render(this,div,{actionView:this.createRightBar()});
    }

    createRightBar(){
        var actionView = (<div src={this.img_tick} className={css.bar_action}
                               {...ClickHelp.onClick(()=>{

                                   this.Help.app_open(this, "/Regist", {
                                       title:"注册",
                                       isForgetPW: false,
                                       callBack:()=>{
                                           this.bindDevice();
                                       }
                                   });
                               })}
                               >注册</div>);
        return actionView;
    }
    createSanFang(){
        var dataArr=[{
            img:this.img_qq,
            title:"",
        },{
            img:this.img_wechat,
            title:"",
        },{
            img:this.img_sina,
            title:"",
        }];
        var itemArr=[];
        for (let index=0;index<dataArr.length;index++){
            let data = dataArr[index];
            var item=(<div key={index} className={css.libItem}
                           {...ClickHelp.onClick(()=>{
                               this.sanFangAuth(index);
                           })}>
                <img className={css.libItemImg}
                     src={data.img}/>
                <div className={css.libItemTitle}>{data.title}</div>
            </div>);
            itemArr.push(item);
        }
        return itemArr;
    }
    sanFangAuth(index){
        var obj=null;
        switch (index){
            case 0:{
                obj = {title: 'QQ登录', id: 'qq',type:"QQ",installType:"com.tencent.mobileqq",alertTitle:"QQ"}
            }
            break;
            case 1:{
                obj = {title: '微信登录', id: 'weixin',type:"WECHAR",installType:"com.tencent.mm",alertTitle:"微信"}
            }
                break;
            case 2:{
                obj = {title: '新浪登录', id: 'sinaweibo',type:"WEIBO",installType:"com.sina.weibo",alertTitle:"微博"}
            }
                break;
            default:
                break;
        }
        // com.sina.weibo
        // com.tencent.mobileqq
        // com.tencent.mm

        LoginHelp.openLogin(obj,(e)=>{
                var item = JSON.parse(e);
                var target = item.target;
                var authResult = target.authResult;
                var openid =null;
                if (index==1){
                    openid=authResult.unionid;
                }else if (index==0){
                    openid=authResult.openid;
                }else if (index==2){
                    openid = authResult.uid;
                }
                this.sanFangLogin(openid,obj.type);
        },(e)=>{
                Toast.showToast("授权失败");
        });
    }

    sanFangLogin(openid,type){
        var param = {
            accountType: type,
            openid:openid,
        };
        var successCallback = (code, message, json, option) => {
            if (code ==1 ){
                CookieHelp.saveUserInfo(json)
                this.bindDevice();
            }else {
                this.Help.app_open(this, "/BindPhone", {
                    title:"绑定手机号",
                    accountType: type,
                    openid:openid,
                    callBack:(isfinish)=>{
                        this.bindDevice();
                    }
                });
            }
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_checkOpenId, successCallback, failCallback, param);
    }
    //绑定设备id
    bindDevice(){//绑定设备号
        HelpBindDevice.bindDevice(0);
        this.Help.setIntent(true);
        this.Help.back(this);
    }

    getVerMobile(phone) {
        if (!(/^1\d{10}$/.test(phone))) {
            return false;
        } else {
            return true;
        }
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;