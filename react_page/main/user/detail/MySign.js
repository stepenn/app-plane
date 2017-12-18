/**
 * Created by apin on 2017/5/25.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './MySign.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';

import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import Toast from '../../../component/Toast/index.js';
import CookieHelp from '../../../tool/CookieHelp.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        var signArr = this.Help.app_getParameter(this).signArr;
        this.delDiy = false;
        this.myAllTag = [];
        this.osAllTag = [];
        this.diyAllTag = [];
        this.myAllTag =  this.addTagForArr(signArr);
        this.state = {
            upData: 0,
        }
        this.icon_delete = window.imgHost + '/images/delete_icon.png';
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
        this.img_tick = window.imgHost + '/images/img_tick.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    isHas(title,arr){
        if(!arr)return -1;
        for(let i=0;i<arr.length;i++){
            if(arr[i].title==title){
                return i;
            }
        }
        return -1;
    }

    addTagForArr(arr,diffArr){
        var allTag = [];
        for(let i=0;i<arr.length;i++){
            if(!diffArr){
                allTag.push({
                    select:true,
                    title:arr[i],
                })
            }else{
                var index = this.isHas(arr[i],diffArr);
                allTag.push({
                    select:index>=0,
                    title:arr[i],
                })
            }

        }
        return allTag;
    }
    upView() {
        this.setState({
            upData: this.state.upData + 1,
        })
    }

    componentWillUnmount() {
        this.Help.close(this);
    }

    animEnter() {
        this.loadOsList();
    }

    loadOsList() {
        var param = {}
        var successCallback = (code, message, json, option) => {
            this.osAllTag =  this.addTagForArr(json,this.myAllTag);
            this.loadDiyList();
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_getDefaultTags, successCallback, failCallback, param);

    }
    loadDiyList() {
        var param = {}
        var successCallback = (code, message, json, option) => {
            this.isMyDiyAllTag = true;
            this.diyAllTag =  this.addTagForArr(json,this.myAllTag);
            this.upView();
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_getUserTags, successCallback, failCallback, param);
    }

    render() {
        var myTagView = [],osTagView = [],diyTagView = [];
        if(this.myAllTag){
            for(let i =0;i<this.myAllTag.length;i++){
                myTagView.push(this.createSign(this.myAllTag[i],i,0))
            }
        }
        if(this.osAllTag){
            for(let i =0;i<this.osAllTag.length;i++){
                osTagView.push(this.createSign(this.osAllTag[i],i,1))
            }
        }
        if(this.diyAllTag){
            for(let i =0;i<this.diyAllTag.length;i++){
                diyTagView.push(this.createSign(this.diyAllTag[i],i,2))
            }
        }
        var div =null;
        if (!this.isMyDiyAllTag){
            div = (<div className={css.main}>
                <div className={css.alertCss}>数据加载中,请耐心等待...</div>
            </div>);
        }else {
            div = (
                <ScrollDivV className={css.main}>
                    <div className={css.row}>
                        <div className={css.left}>已选标签</div>
                    </div>
                    <div className={css.signArea}>
                        {myTagView}
                    </div>

                    <div className={this.osAllTag&&this.osAllTag.length>0?css.row:css.hidden}>
                        <div className={css.left}>选择标签</div>
                    </div>
                    <div className={css.signArea}>
                        {osTagView}
                    </div>

                    <div className={css.row} onClick={() => {
                        if (this.diyAllTag.length>5){
                            Toast.showToast("最多添加5个");
                            return;
                        }
                        this.Help.app_open(this, "/AlterPersonInfor", {
                            title: "添加标签",
                            id:5,
                            callBack:(title)=>{
                                if (!title){
                                    return;
                                }
                                var index = this.isHas(title,this.diyAllTag);
                                if(index>=0){
                                    // alert("has " +title);
                                    return;
                                }
                                if(this.diyAllTag.length>=5){
                                    // alert("max 5");
                                    return;
                                }
                                this.diyAllTag.push({title:title,select:false});
                                this.upView();
                            }
                        });
                    }}>
                        <div className={css.left}>自定义标签</div>
                        <div className={css.right}>
                            <img className={css.img} src={this.img_rightArrow}/>
                        </div>
                    </div>
                    <div className={css.signArea}>
                        {diyTagView}
                    </div>
                </ScrollDivV>);
        }
        var actionView = <img src={this.img_tick} className={css.bar_action} onClick={() => {
            this.submitCreateSign()
        }}/>
        return this.Help.app_render(this, div, {actionView: actionView});
    }
    submitCreateSign(){
        var tags ="";
        for (let i=0;i<this.diyAllTag.length;i++){
            if (i==this.diyAllTag.length-1){
                tags = tags +this.diyAllTag[i].title;
            }else {
                tags = tags +this.diyAllTag[i].title+",";
            }
        }
        var param = {tags:tags}
        var successCallback = (code, message, json, option) => {
            this.submitMySign();
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_updateUserTags, successCallback, failCallback, param);
    }
    submitMySign(){
        var tags ="";
        for (let i=0;i<this.myAllTag.length;i++){
            if (i==this.myAllTag.length-1){
                tags = tags +this.myAllTag[i].title;
            }else {
                tags = tags +this.myAllTag[i].title+",";
            }
        }
        var param = {tags:tags}
        Loading.show(true);
        var successCallback = (code, message, json, option) => {
            Loading.show(false, () => {
                CookieHelp.saveUserInfo(json);
                Toast.showToast("修改成功");
                this.Help.setIntent(true);
                this.Help.back(this);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false, () => {
                Toast.showToast(message);
            });
        };
        HttpTool.post(APIGYW.api_user_userInfoAlter, successCallback, failCallback, param);
    }

//已选标签
    createSign(obj, i,type) {
        var cssv = css.signContent;
        if(type==2&&this.delDiy){
            cssv = css.signContentDel;
        }else{
           cssv =  obj.select?css.signContentA:css.signContent;
        }
        return (
            <div key={i} className={css.signItem}>
                <div className={cssv} onClick={() => {
                    if(type==0){
                        //查找所在 进行更新
                        var index =  this.isHas(obj.title,this.osAllTag);
                        log("index:"+index)
                        obj.select = false;
                        this.upDataAll(obj);
                        this.remove(i,this.myAllTag)
                        this.upView();
                    }else if(type==1||type==2){
                        obj.select = !obj.select;
                        //判断 如果存在，进行修改
                        var index = this.isHas(obj.title,this.myAllTag)
                        log("index:"+index)
                        if(index>=0){
                            if(obj.select){
                                this.myAllTag[index].select = obj.select;
                                this.upDataAll(obj);
                            }else{
                                this.remove(index,this.myAllTag)
                                this.upDataAll(obj);
                            }
                        }else{
                            if(obj.select){
                                this.myAllTag.push(obj);
                                this.upDataAll(obj);
                            }
                            else{
                                this.remove(index,this.myAllTag)
                            }
                        }
                        this.upView();
                    }
                }}>{obj.title}
                </div>
                <div className={type == 2 ? css.signItemDel : css.hidden} style={{
                    backgroundImage: this.Help.getImgUrl(this.icon_delete)
                }} onClick={()=>{
                    if(obj.select){
                        var index = this.isHas(obj.title,this.myAllTag)
                        if(index>=0){
                            this.remove(index,this.myAllTag)
                        }
                    }
                    this.remove(i,this.diyAllTag);
                    this.upView();
                    return;
                }}></div>
            </div>





            );
    }

    upDataAll(obj){
        var  index = this.isHas(obj.title,this.osAllTag);
        if(index>=0){
            this.osAllTag[index].select = obj.select;
        }
        index = this.isHas(obj.title,this.diyAllTag);
        if(index>=0){
            this.diyAllTag[index].select = obj.select;
        }
    }

    remove(dx, arr) {
        if (isNaN(dx) || dx > arr.length) {
            return false;
        }
        for (var i = 0, n = 0; i < arr.length; i++) {
            if (arr[i] != arr[dx]) {
                arr[n++] = arr[i]
            }
        }
        arr.length -= 1
    }

}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;