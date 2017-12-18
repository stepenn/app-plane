/**
 * Created by apin on 2017/5/24.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './TripDetail.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import ItemTripDetail from '../../cell/ItemTripDetail.js';
import ItemTicketInfor from '../../cell/ItemTicketInfor.js';
import ItemOrderPrice from '../../cell/ItemOrderPrice.js';

import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Toast from '../../../component/Toast/index.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import ItemTripShowPerson from '../../cell/ItemTripShowPerson.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.data = this.Help.app_getParameter(this).data;
        this.isTrip = this.Help.app_getParameter(this).isTrip;
        this.state = {
            upData:0,
        }
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
        //this.loadNet();
    }

    render() {
        var div = null;
        if (!this.data){
            div= (<div className={css.main}>
                <div className={css.alertCss}>数据加载中,请耐心等待...</div>
            </div>);
        }else {
            div = (<ScrollDivV className={css.main}>
                <ItemTripDetail data={this.data} isPayShowClicked={false} noShowTotalPrice={true}/>
                <ItemOrderPrice data={this.data.trip} isTrip={this.isTrip} isShow={true} callBack={(status)=>{
                    if (this.isTeam){
                        return;
                    }
                    this.Help.setIntent(status);
                    this.Help.back(this);
                }}/>
                <ItemTicketInfor ticketInforAct={()=>{
                    this.Help.app_open(this, "/TicketInforDesc", {
                        title:"起航小贴士",
                        callBack:(isFinish)=>{

                        }
                    });
                }}/>

                <div className={css.listArea}>
                    {this.createPlanePerson(this.data.passengers)}
                </div>
            </ScrollDivV>);
        }
        return this.Help.app_render(this,div);
    }

    createPlanePerson(arr){
        if (!arr||arr.length<1){
            return (<div></div>);
        }
        var arrPerList=[];
        for (var i=0;i<arr.length;i++){
            let index = i;
            let dataItem = arr[index];
            var item = (<ItemTripShowPerson key={index} index={index} dataItem = {dataItem}/>)
            arrPerList.push(item);
        }
        return arrPerList;
    }

    //请求详情页数据
    loadNet(){
        if (!this.trip_id){
            Toast.showToast("行程不存在");
            return;
        }
        var param={
            trip_id:this.trip_id,
        };
        var successCallback = (code, message, json,option)=> {
            this.data = json;
            this.upView();
        };
        var failCallback = (code, message)=> {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_passenger_getTripDetail, successCallback, failCallback,param);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;