/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import css from './UserInfo.less';
import HelpI from '../../help/Help.js';
import ScrollDivV from '../../component/ScrollDiv/ScrollDivCom.js';
import SelectView from "../../component/Dialog/SelectView/index.js";

import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Loading from '../../component/Dialog/Loading/index.js';
import ImageUp from '../public/ImageUp/index';

import Toast from '../../component/Toast/index.js';
import CookieHelp from '../../tool/CookieHelp.js';
import ImageUpLayout from  '../public/ImageUpLayout/index';

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.userInfo =  CookieHelp.getUserInfo();
        this.imgArr = [];
        if (this.userInfo.images){
            this.imgArr = this.userInfo.images.split(",");
        }
        this.signArr = [];
        if (this.userInfo.tags){
            this.signArr = this.userInfo.tags.split(",");
        }
        this.state = {
            upData:0,
        }
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
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

    }
    openPage(path,option){
        this.Help.app_open(this, path,option)
    }

    render() {
        if (!this.userInfo){
            return <div className={css.main}></div>
        }
        var div = (
            <ScrollDivV className={css.main}>
                <div className={css.row}>
                    <div className={css.left}>头像</div>
                    <div className={css.right}>
                        <div className={css.img}>
                            <ImageUp viewStyle={2}
                                     option={{width:200,quality:50}}
                                     src={this.userInfo.avatar}
                                     successListen={(url)=>{
                                         this.commit(url,"image");
                                     }}/>
                            {/*<img ref={this.state.upData} className={css.imgCon} src={this.userInfo.avatar}/>*/}
                        </div>

                    </div>
                </div>

                {this.createViewList(this.userInfo)}

                <div className={css.signRow} onClick={()=>{
                    this.Help.app_open(this, "/MySign", {
                        title: "我的标签",
                        signArr:this.signArr,
                        callBack:(isfinish)=>{
                            this.Help.setIntent(true);
                            this.userInfo =  CookieHelp.getUserInfo();
                            this.signArr = [];
                            if (this.userInfo.tags){
                                this.signArr = this.userInfo.tags.split(",");
                            }else {
                                this.signArr = [];
                            }
                            this.upView();
                        }
                    });
                }}>
                    <div className={css.refLeft}>个人标签</div>
                    <div className={css.refRight}>
                        <img className={css.refImg} src={this.img_rightArrow}/>
                    </div>
                </div>
                <div className={css.signArea}>
                    {this.createSign()}
                </div>

                <div className={css.imgRow}>
                    <div className={css.refLeft}>选择图片</div>
                </div>
                <div className={css.imageLayoutWidth}>
                    <div className={css.imageLayout}>
                        <ImageUpLayout
                            option={{width:480,quality:30}}
                            url={this.userInfo.images?this.userInfo.images.split(","):null}
                            maxSize={5}
                            notice={(url)=>{
                                this.commitImg(url);
                            }}
                            obj={(obj)=>{
                                this.imageUpLayout = obj;
                            }}
                        />
                    </div>
                </div>
                <br/>


            </ScrollDivV>
        );
        return this.Help.app_render(this,div);
    }

    createViewList(userInfo){
        return (<div>
            <div className={css.row} onClick={()=>{
                this.Help.app_open(this, "/AlterPersonInfor", {
                    title: "修改昵称",
                    id:1,
                    name:userInfo.nick_name,
                    callBack:(isfinish)=>{
                        this.Help.setIntent(true);
                        this.userInfo =  CookieHelp.getUserInfo();
                        this.upView();
                    }
                })
            }}>
                <div className={css.name}>昵称</div>
                <div className={css.content}>{userInfo.nick_name}</div>
            </div>

            <div className={css.refRow} onClick={()=>{
                this.Help.app_open(this, "/AlterPersonInfor", {
                    title: "修改性别",
                    id:2,
                    name:userInfo.gender,
                    callBack:(isFinish)=>{
                        this.Help.setIntent(true);
                        this.userInfo =  CookieHelp.getUserInfo();
                        this.upView();
                    }
                });
                // SelectView.open((value,indexs,lastData)=>{
                //     this.commit(lastData.id,"sex");
                // },[{title:"男",id:1},{title:"女",id:2}])
            }}>
                <div className={css.name}>性别</div>
                <div className={css.content}>{userInfo.gender==1?"男":"女"}</div>
            </div>
            <div className={css.refRow} onClick={()=>{
                this.Help.app_open(this, '/SelectCityList',
                    {
                        title: "选择城市",
                        callBack:(city)=>{
                            if(city&&city.city_name){
                                this.commit(city.city_name,"city_name");
                            }
                        }})
            }}>
                <div className={css.name}>常居城市</div>
                <div className={css.content}>{userInfo.city_name}</div>
            </div>

            <div className={css.refRow} onClick={()=>{
                this.Help.app_open(this, "/AlterPersonInfor", {
                    title: "个人介绍",
                    id:4,
                    name:userInfo.memo,
                    callBack:(isfinish)=>{
                        this.Help.setIntent(true);
                        this.userInfo =  CookieHelp.getUserInfo();
                        this.upView();
                    }
                })
            }}>
                <div className={css.name}>个人介绍</div>
                <div className={css.content}>{userInfo.memo}</div>
            </div>
        </div>);
    }

    createSign(){
        var signViewArr =[];
        for(var i = 0;i<this.signArr.length;i++){
            let index = i;
            var signView = (<div key={index} className={css.signContent}>{this.signArr[index]}</div>);
            signViewArr.push(signView);
        }
        return signViewArr;
    }
    //提交修改数据
    commit(tx,type){
        var param={}
        if (type=="image"){
            param ={avatar:tx}
        }else if (type=="city_name"){
            param ={city_name:tx}
        }else {
            return;
        }
        var successCallback = (code, message, json, option) => {
            this.Help.setIntent(true);
            CookieHelp.saveUserInfo(json);
            Toast.showToast(message);
            this.userInfo =  CookieHelp.getUserInfo();
            this.upView();
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_userInfoAlter, successCallback, failCallback, param);
    }

    //上传用户图片
    commitImg(urls){
        var url = urls.toString();
        Loading.show(true);
        var param={images:url}
        var successCallback = (code, message, json, option) => {
            this.userInfo = CookieHelp.getUserInfo();
            this.userInfo.images = url;
            CookieHelp.saveUserInfo(this.userInfo);
            Loading.show(false);
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