/**
 * Created by apin on 2017/5/25.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './TicketState.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import ItemTripDetail from '../../cell/ItemTripDetail.js';
import ItemTicketInfor from '../../cell/ItemTicketInfor.js';
import ItemOrderPrice from '../../cell/ItemOrderPrice.js';
import ItemTripShowPerson from '../../cell/ItemAddPerson.js'

import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Toast from '../../../component/Toast/index.js';
import Loading from '../../../component/Dialog/Loading/index.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.orderNo = this.Help.app_getParameter(this).orderNo;
        this.state = {
            upData:0,
        }
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.perDataArr=[];
    }

    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }

    animEnter(){
        this.loadNet();
    }

    render() {
        var div = null;
        if (!this.data){
            div= (<div className={css.main}></div>);
        }else {
            div = (<ScrollDivV className={css.main}>
                <ItemTripDetail className={css.marginTop} item={this.data}/>

                <ItemOrderPrice data={this.data}/>

                <ItemTicketInfor className={css.marginTop} ticketInforAct={()=>{
                    alert("起航小贴士");
                }}/>

                <ItemTripShowPerson perDataArr={this.perDataArr} Help={this.Help}/>
                {/*<div className={css.refCell} onClick={()=>{*/}
                    {/*this.Help.app_open(this, "/MyPlane",{*/}
                        {/*title:"添加乘机人",*/}
                        {/*isSelectPer:true,*/}
                        {/*callBack:(myItem)=>{*/}
                            {/*if (!this.perDataArr||this.perDataArr.length<1){*/}
                                {/*this.perDataArr.push(myItem);*/}
                                {/*this.upView();*/}
                            {/*}else {*/}
                                {/*var isRepeat = false;*/}
                                {/*for (let i=0;i<this.perDataArr.length;i++){*/}
                                    {/*var item = this.perDataArr[i];*/}
                                    {/*if (item.id_no==myItem.id_no){*/}
                                        {/*isRepeat = true;*/}
                                        {/*break;*/}
                                    {/*}*/}
                                    {/*if (!isRepeat){*/}
                                        {/*this.perDataArr.push(myItem);*/}
                                        {/*this.upView();*/}
                                    {/*}*/}
                                {/*}*/}
                            {/*}*/}
                        {/*}}*/}
                    {/*)*/}
                {/*}}>*/}
                    {/*<div className={css.leftCell}>*/}
                        {/*<div className={css.title}>添加乘机人</div>*/}
                    {/*</div>*/}
                    {/*<div className={css.rightCell}>*/}
                        {/*<img className={css.imgCell} src={require("../../cell/right_click_icon.png")}/>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*{this.createAddPer()}*/}

                <div className={css.submit} style={{
                    backgroundImage: this.Help.getImgUrl(this.submit)
                }} onClick={()=> {
                    this.submit();
                }}>支付</div>
            </ScrollDivV>);
        }
        return this.Help.app_render(this,div);
    }

    createAddPer(){
        if (!this.perDataArr||this.perDataArr.length<1){
            return (<div></div>);
        }
        var divArr = [];
        for (let i = 0;i<this.perDataArr.length;i++){
            let item = this.perDataArr[i];
            var div = (<div key={i} className={css.cell} onClick={()=>{
                this.Help.app_open(this, "/AddPlanePer",{
                    title:"添加乘机人",
                    prarm:item,
                    callBack:(myData)=>{
                        this.perDataArr.splice(i,1,myData);
                        this.upView();
                    }})
            }}>
                <div className={css.leftCell}>
                    <div className={item.type?css.title:css.hidden}>{"乘机人信息("+(item.type==1?"成人":"儿童") +")"}</div>
                    <div className={item.passenger_name?css.title:css.hidden}>{item.passenger_name?item.passenger_name:""}</div>
                    <div className={item.id_type?css.refTitle:css.hidden}>{item.id_type?this.myIdCardType(item.id_type):""}</div>
                    <div className={item.id_no?css.con:css.hidden}>{item.id_no?item.id_no:""}</div>
                </div>
                <div className={css.rightCell}>
                    <img className={css.imgCell} src={this.img_rightArrow}/>
                </div>
            </div>)
            divArr.push(div);
        }
        return divArr;

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
    submit(){

    }
    //请求详情页数据
    loadNet(){
        if (!this.orderNo){
            Toast.showToast("订单不存在");
            return;
        }
        var param={
            trip_id:this.order_id,
        };
        Loading.show(true);
        var successCallback = (code, message, json,option)=> {
            Loading.show(false,()=>{
                this.data = json;
                this.upView();
            })
        };
        var failCallback = (code, message)=> {
            Loading.show(false,()=>{
                Toast.showToast(message);
            })

        };
        //HttpTool.post(APIGYW.api_passenger_getTripDetail, successCallback, failCallback,param);

        this.data = {
            startDate:"5月1日",
            endDate:"5月5日",
            useDate:"共4天",
            title:"吉祥 HO1305",
            start:"11:30",
            end:"11.30",
            useTime:"2h33min",
            startPlace:"萧山国际机场",
            endPlace:"台北国际机场",
            price:"￥2200",
            id:"412825199108094118",
        }
        Loading.show(false,()=>{
            this.upView();
        })
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;