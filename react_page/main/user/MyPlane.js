/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import css from './MyPlane.less';
import HelpI from '../../help/Help.js';
import ListView from '../../component/ListView/ListView.js';
import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Toast from '../../component/Toast/index.js';
import ScrollDivV from '../../component/ScrollDiv/ScrollDivCom.js';
import Switch from "../public/Switch/index.js";
import ClickHelp from '../../tool/ClickHelp.js';
import SelectAlert from '../../component/Dialog/Select/index.js'

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.isSelectPer = this.Help.app_getParameter(this).isSelectPer;
        this.selectArr = this.Help.app_getParameter(this).selectArr;
        this.selectArr = this.selectArr?this.selectArr:[];
        this.state = {
            upData: 0,
        }
        this.img_searchBG = window.imgHost + '/images/img_bar.png';
        this.img_back = window.imgHost + '/images/img_back.png';
        this.img_add = window.imgHost + '/images/img_addId.png';
        this.img_editIcon = window.imgHost + '/images/edit_icon.png';
        this.img_delIcon = window.imgHost + '/images/del_icon.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    upView() {
        this.setState({
            upData: this.state.upData + 1,
        })
    }
    animEnter() {
        this.loadNet();
    }
    loadNet() {
        //参数
        var param={};
        var successCallback = (code, message, json,option)=> {
            if (this.isSelectPer){
                this.matchData(json);
            }else {
                this.data = json;
                this.upView();
            }
        };
        var failCallback = (code, message,option)=> {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_passenger_getPassengerList, successCallback, failCallback,param);
    }
    matchData(json){
        if (!json||json.length<1){
            json=[];
        }
        for (let i=0;i<json.length;i++){
            let isSelect = false;
            let item = json[i];
            if (this.selectArr.length>0){
                for (let j=0;j<this.selectArr.length;j++) {
                    var myItem = this.selectArr[j];
                    if (item.id_no==myItem.id_no){
                        isSelect = true;
                        break;
                    }
                }
            }
            item.isSelect = isSelect;
        }
        this.data = json;
        this.upView();
    }
    dele(id ,index){
        if (!id){
            Toast.showToast("用户id不存在");
            return;
        }
        //参数
        var param={id:id};
        var successCallback = (code, message, json,option)=> {
            Toast.showToast("删除成功");
            this.remove(index,this.data);
            this.upView();
        };
        var failCallback = (code, message,option)=> {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_passenger_delPassenger, successCallback, failCallback,param);
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
    getItemView(data){
        if (!data){
            return (<div></div>);
        }
        var itemArr = [];
        for (let i = 0;i<data.length;i++){
            let itemData = data[i];
            var div = (<div {...this.props} className={css.cell} key={"key"+i} onClick={()=>{
                if (this.isSelectPer){
                    this.Help.setIntent(itemData);
                    this.Help.back(this);
                }
            }}>
                <div className={this.isSelectPer?css.right:css.hidden}>
                    <Switch className={css.img} defaultSelect = {itemData.isSelect} isEventsThrough={true}/>
                </div>

                <div className={this.isSelectPer?css.refLeft:css.left}>
                    <div className={css.row}>
                        <div className={css.name}>姓名</div>
                        <div className={css.content}>
                            <span className={css.fontBig}>{itemData.passenger_name}</span>
                            <span className={css.fontSmall}>{itemData.type==2?" (儿童)":" (成人)"}</span>
                        </div>
                    </div>
                    <div className={css.refRow}>
                        <div className={css.refName}>{this.myIdCardType(itemData.id_type)}</div>
                        <div className={css.refContent}>{itemData.id_no}</div>
                    </div>
                </div>

                <div className={css.right}>
                    <img className={css.img} src={this.img_editIcon} onClick={(e)=> {
                        ClickHelp.stopClick(e);
                        //编辑功能
                        this.Help.app_open(this, "/AddPlanePer", {
                            title:"编辑乘机人",
                            prarm:itemData,
                            callBack:(myData)=>{
                                this.data.splice(i,1,myData);
                                this.upView();
                            }
                        });
                    }}/>
                </div>
                <div className={css.right}>
                    <img className={css.img} src={this.img_delIcon} onClick={(e)=> {
                        ClickHelp.stopClick(e);
                        //删除功能
                        SelectAlert.open((yes)=>{
                            this.selectYes = yes;
                        },{
                            title:"温馨提示",
                            content:"确定删除?",
                            isShow:true,
                        },()=>{
                            //关闭之后
                            if(this.selectYes){
                                //关闭页面 并进行操作
                                this.dele(itemData.id, i);
                            }else{
                                //
                            }
                        });
                    }}/>
                </div>
            </div>);
            itemArr.push(div);
        }
        return itemArr;
    }
    myIdCardType(idType){
        var myType = "";
        var type = parseInt(idType);
        switch (type){
            case 1 : {
                myType = "身份证";
            }
                break;
            case 2 : {
                myType = "护照";
            }
                break;
            case 3 : {
                myType = "军人证";
            }
                break;
            case 4 : {
                myType = "港澳通行证";
            }
                break;
            default : {
                myType = "";
            }
                break;
        }
        return myType;
    }
    render() {
        var div = null;
        if (!this.data){
            div = (<div className={css.main}>
                <div className={css.alertCss}>数据加载中,请耐心等待...</div>
            </div>)
        }else if(this.data.length<1) {
            <div className={css.alertCss}>{"您暂未添加乘机人 >_<"}</div>
        }else {
            div = (<ScrollDivV className={css.main}>
                    {this.getItemView(this.data)}
                </ScrollDivV>
            );
        }
        var barView = (
            <div className={css.searchBg} style={{
                backgroundImage: this.Help.getImgUrl(this.img_searchBG)
            }}>
                <div className={css.leftBar} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_back)
                }} onClick={()=>{
                    this.Help.back(this);
                }}></div>
                <div className={css.searchBar}>
                    {this.isSelectPer?"添加乘机人":"我的乘机人"}

                    {/*<div className={css.searchLeft}>*/}
                        {/*<img className={css.searchImg} src={require("./images/isClicked.png")}/>*/}
                    {/*</div>*/}
                    {/*<div className={css.searchRight}>*/}
                        {/*<input className={css.searchInput} placeholder="输入您要查找的乘机人姓名"/>*/}
                    {/*</div>*/}
                </div>

                <div className={css.rightBar} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_add)
                }} onClick={()=>{
                    this.Help.app_open(this, "/AddPlanePer", {
                        title:"添加乘机人",
                        callBack:(item)=>{
                            if(this.data){
                                var dataArr = [item];
                                this.data = dataArr.concat(this.data)
                            }else {
                                var dataArr = [item];
                                this.data = [];
                                this.data = dataArr.concat(this.data)
                            }
                            this.upView();
                        }
                    });
                }}></div>
            </div>
        );
        return this.Help.app_render(this,div,{barView:barView});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;