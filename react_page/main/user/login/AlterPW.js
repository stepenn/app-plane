/**
 * Created by apin on 2017/5/22.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './AlterPW.less';
import InputCellNew from '../../../tool/InputRow/InputCellNew.js';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import Toast from '../../../component/Toast/index.js';
import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import ClickHelp from '../../../tool/ClickHelp.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.img_userIcon = window.imgHost + ("/images/icon_user.png");
        this.img_pwIcon = window.imgHost + ("/images/icon_lock.png");
        this.img_submit = window.imgHost + '/images/submit_btn.png';
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
            hint:"请输入验证码",
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
        dataS.push({
            name:"password",
            title:"密码",
            hint:this.isForget?"请输入您的新密码":"请输入您的密码",
            type:"password",
            reg:/^[\S]{8,16}$/,
            regTitle:"8-20位的字母数字组合(不支持特殊字符)",
            icon:this.img_userIcon,
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
        if(!this.dataS){
            this.dataS = this.getShowData();
        }
        let size = this.dataS.length;
        var viewS = [];
        for(var i=0;i<size;i++){
            viewS.push(this.getShowRow(this.dataS[i],i));
        }
        return viewS;
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
            <div className={css.paddingTop}></div>
            {this.getShowView()}
            <div className={css.submit} style={{
                backgroundImage: this.Help.getImgUrl(this.img_submit)
            }} {...ClickHelp.onClick(()=>{
                this.submit();
            })}>确定</div>
        </ScrollDivV>);
        return this.Help.app_render(this,div);
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
        var codeType = this.isForgetPW?"2":"0";
        //参数
        var param = {
            mobile: data.value,
            codeType:2,
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

    submit() {
        //获取真实值
        for(var i in this.inputList){
            this.inputList[i].getValue(this.dataS[i]);
        }
        var param = {};
        var size = this.dataS.length;
        for(var i=0;i<size;i++){
            let d = this.dataS[i];
            if(d.type=="password"){
                if(!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(d.value))){
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

        Loading.show(true);
        var successCallback = (code, message, json, option) => {
            Loading.show(false, () => {
                Toast.showToast("修改成功");
                this.Help.back(this);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false, () => {

            });
        };
        HttpTool.post(APIGYW.api_passenger_resetPwd, successCallback, failCallback, param);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;