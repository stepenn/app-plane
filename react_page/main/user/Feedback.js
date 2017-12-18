/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import css from './Feedback.less';
import HelpI from '../../help/Help.js';
import ScrollDivV from '../../component/ScrollDiv/ScrollDivCom.js';
import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Toast from '../../component/Toast/index.js';
import Loading from '../../component/Dialog/Loading/index.js';
import ClickHelp from '../../tool/ClickHelp.js';

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state = {
            numSug:0,
        }
        this.mobileRegExp = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/;
        this.telephoneRegExp = /^(0(([12]\d)|(\d{3}))-?\d{7,8})$/
        this.img_board = window.imgHost + '/images/bg_board.png';
        this.img_inputPW = window.imgHost + '/images/input_PW.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
    }
    submitUserfeedback() {
        var submit=this.refs.submit.value;
        if(!submit||submit.length<1){
            Toast.showToast("请输入反馈内容")
            return;
        }
        var relate=this.refs.relate.value;
        if (relate){
            // if (relate.length>12){
            if (!relate.match(this.mobileRegExp)||!relate.match(this.telephoneRegExp)){
                Toast.showToast("请核对您的联系方式...");
                return;
            }
        }else {
            relate = "";
        }
        var param={
            feedBackMsg:submit,
            concat:relate,
        };
        Loading.show(true);
        var successCallback = (code, message, json,option)=> {
            Loading.show(false,()=>{
                Toast.showToast("感谢您的反馈");
                this.Help.back(this);
            });
        };
        var failCallback = (code, message)=> {
            Loading.show(false,()=>{
                Toast.showToast(message);
            });
        };
        HttpTool.post(APIGYW.api_user_userFeedback, successCallback, failCallback,param);
    }
    render() {
        var div = (
            <ScrollDivV className={css.main}>
                <div className={css.row}>
                    <div className={css.left}>反馈内容</div>
                    <div className={css.right}>{this.state.numSug +"/100字"}</div>
                </div>

                <textarea ref={"submit"} className={css.text} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_board)
                }} placeholder="您的反馈,是对我们最大的鼓励～" onChange={()=>{
                    this.textOnChange("submit",101);
                }}></textarea>

                <div className={css.styleRelate}>联系方式(暂只支持手机号和座机号)</div>
                <div className={css.refRow}>
                    <input ref={"relate"} type="number" className={css.relateInput} style={{
                        backgroundImage:this.Help.getImgUrl(this.img_inputPW)
                    }} placeholder="请输入您的联系方式(选填)"/>
                    <div className={css.submit} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_submit)
                    }}
                         {...ClickHelp.onClick(()=>{
                             this.submitUserfeedback();
                         })}
                         >确定</div>
                </div>
            </ScrollDivV>
        );
        return this.Help.app_render(this,div);
    }
    textOnChange(textSign,maxChars){
        var val=this.refs.submit.value;
        if (val.length >= maxChars){
            val = val.substring(0,maxChars-1);
            this.refs.submit.value = val;
            Toast.showToast("最多输入"+(maxChars-1)+"个字符～");
        }else{
            this.refs.submit.value=val;
        }
        this.setState({
            numSug:val.length,
        })
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;