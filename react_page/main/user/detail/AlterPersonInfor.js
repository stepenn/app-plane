/**
 * Created by apin on 2017/5/25.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './AlterPersonInfor.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import Toast from '../../../component/Toast/index.js';
import CookieHelp from '../../../tool/CookieHelp.js';
import ClickHelp from '../../../tool/ClickHelp.js';


// import HttpTool from '../../http/HttpTool.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.id = this.Help.app_getParameter(this).id;
        this.name=this.Help.app_getParameter(this).name;
        this.state = {
            numSug:this.name?this.name.length:"0",
            isMan:this.name=="1"?true:false,
        }
        this.img_tick = window.imgHost + '/images/img_tick.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }

    render() {
        var div =null;
        if (this.id == 2){
            div =  (<ScrollDivV className={css.main}>
                <div className={css.lineCell} onClick={()=>{
                    this.setState({
                        isMan:true,
                    });
                }}>
                    <div className={css.lineLeft}>男</div>
                    <div className={css.lineRight}>
                        <img className={this.state.isMan?css.lineImg:css.hidden} src={this.img_tick}/>
                    </div>
                </div>

                <div className={css.lineCell} onClick={()=>{
                    this.setState({
                        isMan:false,
                    })
                }}>
                    <div className={css.lineLeft}>女</div>
                    <div className={css.lineRight}>
                        <img className={this.state.isMan?css.hidden:css.lineImg} src={this.img_tick}/>
                    </div>
                </div>
            </ScrollDivV>);
        }else {
            var title="";
            var textNum="";
            var num=0;
            var placeholder="";
            if (this.id==1){
                title="修改昵称";
                textNum="/11字";
                num=12;
                placeholder="请输入新的昵称，支持字母、数字和汉字，最长不超过11位";
            }else if(this.id==4){
                title="个人简介";
                textNum="/100字";
                num=101;
                placeholder="请输入个人简介";
            }else if(this.id==5){
                title="自定义标签";
                textNum="/6字";
                num=7;
                placeholder="请输入自定义标签";
            }else {
                title="";
                textNum="";
                num=0;
                placeholder="";
            }
            div =  (<ScrollDivV className={css.main}>
                <div className={css.row}>
                    <div className={css.left}>{title}</div>
                    <div className={this.id!=5?css.right:css.hidden}>{this.state.numSug + textNum}</div>
                </div>
                <textarea ref={"submit"}
                          className={this.id==1||this.id==5?css.text:css.refText}
                          defaultValue={this.name}
                          placeholder={placeholder}
                          onChange={()=>{
                              if (this.id!=5){
                                  this.textOnChange(num);
                              }
                          }}></textarea>
            </ScrollDivV>);
        }

        var actionView = <img src={this.img_tick} className={css.bar_action}
                              {...ClickHelp.onClick(()=>{
                                  this.submit();
                              })}
                              />
        return this.Help.app_render(this,div,{actionView:actionView});
    }

    textOnChange(maxChars){
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
    submit(){
        var param={}
        var val="";
        if (this.id==2){
            param ={gender:this.state.isMan?"1":"2"}
        }else {
            val=this.refs.submit.value;
            if (this.id==1){
                param ={nick_name:val}
            }else if (this.id==5){
                if (val.length>6){
                    Toast.showToast("最多输入6个字符～");
                    return;
                }
                this.Help.setIntent(val);
                this.Help.back(this);
                return;
            }else {
                param ={memo:val}
            }
        }
        Loading.show(true);
        var successCallback = (code, message, json, option) => {
            Loading.show(false,()=>{
                Toast.showToast("修改成功");
                CookieHelp.saveUserInfo(json);
                this.Help.setIntent(true);
                this.Help.back(this);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false,()=>{
                Toast.showToast(message);
            });
        };
        HttpTool.post(APIGYW.api_user_userInfoAlter, successCallback, failCallback, param);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;