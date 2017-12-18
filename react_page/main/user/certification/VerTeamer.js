/**
 * Created by apin on 2017/6/8.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './VerTeamer.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Toast from '../../../component/Toast/index.js';
import CookieHelp from '../../../tool/CookieHelp.js'
import ClickHelp from '../../../tool/ClickHelp.js';

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state = {
            isMan:1,
        }
        this.img_input = window.imgHost + '/images/bg_label.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    render() {
        var div = (<ScrollDivV className={css.main} >
            <div className={css.title}>姓名</div>
            <input ref={"myName"} className={css.input} placeholder="请输入姓名"/>

            <div className={css.title}>性别</div>
            <div className={css.row}>
                <div className={this.state.isMan == 1 ? css.sexBtnBg : css.sexBtnNoBg} style={{
                    backgroundImage: this.Help.getImgUrl(this.state.isMan == 1 ? this.img_input : '')
                }}
                     {...ClickHelp.onClick(()=>{
                         this.setState({
                             isMan:1,
                         })
                     })}
                     >男</div>
                <div className={this.state.isMan == 1 ? css.sexBtnNoBg : css.sexBtnBg} style={{
                    backgroundImage: this.Help.getImgUrl(this.state.isMan == 1 ? '' : this.img_input)
                }}
                     {...ClickHelp.onClick(()=>{
                         this.setState({
                             isMan:2,
                         })
                     })}
                     >女</div>
            </div>

            <div className={css.title}>常居城市</div>
            <div className={css.refRow}
                 {...ClickHelp.onClick(()=>{
                     this.Help.app_open(this, '/SelectCityList',
                         {
                             title: "选择城市",
                             callBack:(city)=>{
                                 if(city&&city.city_name){
                                     this.refs.city.value = city.city_name;
                                 }
                             }})
                 })}
            >
                <input ref={"city"} className={css.left} readOnly placeholder="请选择常居城市"/>
                <div className={css.right}>
                    <img className={css.img} src={this.img_rightArrow}/>
                </div>
            </div>


            <div className={css.title}>身份证号</div>
            <input ref={"idCard"} className={css.input} placeholder="请输入身份证号"/>

            <div className={css.title}>电子导游证号</div>
            <input ref={"cerID"} className={css.input} placeholder="请输入电子导游证号"/>

            <div className={css.submit} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_submit)
                }}
                 {...ClickHelp.onClick(()=>{
                     var userInfor = CookieHelp.getUserInfo();
                     if(!userInfor){
                         Toast.showToast("请登陆...");
                         return;
                     }
                     if (userInfor.status ==1){
                         Toast.showToast("正在审核中...");
                     }else{
                         this.submit();
                     }
                 })}
                >下一步</div>
        </ScrollDivV>);
        return this.Help.app_render(this,div);
    }


    submit() {
        var isMyName = this.verIsNull(this.refs.myName.value,1);
        if (!isMyName){
            return;
        }
        var isCity = this.verIsNull(this.refs.city.value,2);
        if (!isCity){
            return;
        }
        var isIdCard = this.verIsNull(this.refs.idCard.value,3);
        if (!isIdCard){
            return;
        }
        var isCerID = this.verIsNull(this.refs.cerID.value,4);
        if (!isCerID){
            return;
        }
        var myName = this.refs.myName.value;
        var city = this.refs.city.value;
        var idCard = this.refs.idCard.value;
        var cerID = this.refs.cerID.value;

        var sex = this.state.isMan;
        var param={
            name:myName,
            gender:sex,
            city:city,
            idcard:idCard,
            leader_card:cerID,
        };

        // var param={
        //     name:"葛艳威",
        //     gender:1,
        //     city:"杭州",
        //     idcard:"412825199108094118",
        //     leader_card:"88888888888888",
        // };
        this.Help.app_open(this, "/CerID", {
            title:"身份认证",
            param:param,
            callBack:(isFinish)=>{
                if (isFinish){
                    this.Help.setIntent(true);
                    this.Help.back(this);
                }

            }
        });
    }
    verIsNull(value ,type){
        switch (type){
            case 1:{
                if (value&&value.length>0){
                    if (value.length<2){
                        Toast.showToast("名字不少于两个字符");
                        return false;
                    }else if (value.length<11){
                        return true;
                    }else {
                        Toast.showToast("姓名最多10个字符");
                        return false;
                    }
                }else {
                    Toast.showToast("请输入你的名字");
                    return false;
                }
            }
            case 2:{
                if (value&&value.length>0){
                    return true;
                }else {
                    Toast.showToast("请选择城市");
                    return false;
                }
            }
            case 3:{
                if (value&&value.length>0){
                    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                    if (reg.test(value)){
                        return true;
                    }else {
                        Toast.showToast("请核对您的身份证号");
                        return false;
                    }
                }else {
                    Toast.showToast("请输入您的身份证号");
                    return false;
                }
            }
            case 4:{
                if (value&&value.length>0){
                    return true;
                }else {
                    Toast.showToast("请输入您的电子导游证号");
                    return false;
                }
            }
            default:
                return false;
        }

    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;