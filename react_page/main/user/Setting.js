/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import HelpI from '../../help/Help.js';
import css from './Setting.less';
import CellView from '../cell/CellItem.js';
import HttpTool from '../../http/HttpTool.js';
import APILXF from '../../http/APILXF.js';
import  ScrollDivV from '../../component/ScrollDiv/ScrollDivCom.js';
import  Loading from '../../component/Dialog/Loading/index.js';
import Toast from '../../component/Toast/index.js';

import  CookieHelp  from '../../tool/CookieHelp.js';
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.img_set = window.imgHost + '/images/icon_set.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    getActionData(){
        return [
            {
                title:"关于爱拼机",
                src:this.img_set,
                show_icon:false,
                onClick:()=>{
                    this.openPage("/AboutAiPinJi",{
                        title:"关于爱拼机",
                    });
                }
            },
            {
                title:"修改登陆密码",
                src:this.img_set,
                show_icon:false,
                onClick:()=>{
                    this.openPage("/AlterPW",{
                        title:"修改密码",
                    });
                }
            }
        ];
    }

    openPage(path,option){
        this.Help.app_open(this, path,option)
    }

    getActionList(data){
        var listView = [];
        let size = data.length;
        for(var i=0;i<size;i++){
            let index = i;
            let dataItem = data[i];
            var mainItme= (
                <CellView key={index} onClick={()=> {
                    dataItem.onClick();
                }} item={dataItem}/>
            );
            listView.push(mainItme);

        }
        return listView;
    }
    login() {
        this.Help.app_open(this, "/Login", {
            title:"登录",
        });
    }
    exitLogin() {
        var param  = {};
        Loading.show(true);
        var successCallback = (code, message, json, option) => {
            Loading.show(false,()=>{
                CookieHelp.clearUserInfo();
                this.Help.setIntent(true);
                this.Help.back(this);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false,()=>{
                CookieHelp.clearUserInfo();

                this.Help.back(this);

            });

        };
         HttpTool.post(APILXF.api_user_loginOut, successCallback, failCallback, param);
    }
    render() {
        var uinfo = CookieHelp.getUserInfo();
        var div = (
            <ScrollDivV className={css.main}>
                <div className={css.line}/>
                <div>
                    {this.getActionList(this.getActionData())}

                    <div className={css.exitLogin} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_submit)
                    }} onClick={()=>{
                        if(uinfo){
                            this.exitLogin();
                        }else{
                            this.login();
                        }
                    }}>{
                        uinfo?"退出登录":"登录"
                    }
                    </div>
                </div>
            </ScrollDivV>
        );
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;