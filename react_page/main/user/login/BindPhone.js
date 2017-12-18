/**
 * Created by apin on 2017/5/22.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './Regist.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import HttpTool from '../../../http/HttpTool.js';
import InputCellNew from '../../../tool/InputRow/InputCellNew.js';
import APIGYW from '../../../http/APIGYW.js';
import Toast from '../../../component/Toast/index.js';
import CookieHelp from '../../../tool/CookieHelp.js';
import ClickHelp from '../../../tool/ClickHelp.js';

class BindPhone extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();

        this.accountType = this.Help.app_getParameter(this).accountType;
        this.openid = this.Help.app_getParameter(this).openid;
        this.img_userIcon = window.imgHost + ("/images/icon_user.png");
        this.img_pwIcon = window.imgHost + ("/images/icon_lock.png");
        this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }

    getShowData(){
        var dataS = [];
        dataS.push({
            name:"mobile",
            title:"手机号",
            hint:"请输入您的手机号",
            type:"number",
            reg:/^1\d{10}$/,
            regTitle:"11位数字",
            icon:this.img_userIcon
        });
        dataS.push({
            name:"verificationCode",
            title:"验证码",
            hint:"请输入短信验证码",
            type:"number",
            reg:/^\d{6}$/,
            regTitle:"6位数字",
            viewSend:true,
            sendCallBack:(clearSendMsg,autoTime)=>{
                //执行发送验证码
                this.sendSMS(clearSendMsg,autoTime);
            },
            icon:this.img_userIcon
        });
        let size = dataS.length;
        for(var i =0;i<size;i++){
            let index = i;
            dataS[i].callBack = (data)=>{
                //数据填充回调
                dataS[index] = data;
            }
        }
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
    getShowRow(data,i){
        return (
            <InputCellNew data={data} key={i} getObject={(obj)=>{
                if(!this.inputList){
                    this.inputList =[]
                }
                obj.data = data;
                this.inputList.push(obj);
            }}/>
        );
    }

    render() {
        var div = (<ScrollDivV className={css.main}>
            <div className={css.mainContent}>
                <div className={css.img}>
                    <div className={css.imgCon} style={{
                        backgroundImage:this.Help.getImgUrl(this.img_defaultAvatar)
                    }}></div>
                </div>
                {this.getShowView()}
                <div style={{
                    backgroundImage: this.Help.getImgUrl(this.img_submit)
                }} {...ClickHelp.onClick(()=>{
                    this.submit();
                })}
                    className={css.submit}>登陆</div>
            </div>
        </ScrollDivV>);
        return this.Help.app_render(this,div);
    }

    submit(){
        //获取真实值
        for(var i in this.inputList){
            this.inputList[i].getValue(this.dataS[i]);
        }
        var param = {};
        var size = this.dataS.length;
        for(var i=0;i<size;i++){
            let d = this.dataS[i];
            if(!d.reg_state){
                Toast.showToast(d.hint+" ("+d.regTitle+")")
                return;
            }
            param[d.name] = d.value;
        }
        param.accountType =this.accountType;
        param.openid =this.openid;
        Loading.show(true);
        var successCallback = (code, message, json, option) => {
            Loading.show(false,()=>{
                Toast.showToast(message);
                CookieHelp.saveUserInfo(json);
                //返回登录页面
                this.Help.setIntent(true);
                this.Help.back(this);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false,()=>{
                Toast.showToast(message);
            });
        };
        HttpTool.post(APIGYW.api_user_authBindPhone, successCallback, failCallback, param);
    }

    //发送验证码
    sendSMS(clearSendMsg,autoTime) {
        //获取手机号字段
        var data = this.dataS[0];//手机号
        if (!data.reg_state) {
            Toast.showToast(data.hint+" ("+data.regTitle+")");
            return;
        }
        autoTime();
        //参数
        var param = {
            mobile: data.value,
            codeType:3,
            accountType:this.accountType,
        };

        var successCallback = (code, message, json, option) => {
            if (code == 1) {
                Toast.showToast("发送成功",);
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
}
BindPhone.contextTypes = {
    router: React.PropTypes.object
}
module.exports = BindPhone;