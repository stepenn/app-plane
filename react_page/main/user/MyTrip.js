/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import HelpI from '../../help/Help.js';
import css from './MyTrip.less';
import ListView from '../../component/ListView/ListView.js';
import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Toast from '../../component/Toast/index.js';
import CookieHelp from '../../tool/CookieHelp.js'
import TimeHelp from '../../tool/TimeHelp.js';
import ClickHelp from '../../tool/ClickHelp.js'
import ItemTripDetail from '../cell/ItemTripDetail.js';

import ScrollView from  '../../component/ScrollDiv/ScrollDivCom.js';

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.userInfor = CookieHelp.getUserInfo();
        this.state = {
            upData:0,
        }
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }
    render() {
        var div = (
            <ListView className={css.main}
                      getListData={this.loadData.bind(this)}
                      getItemView={this.getItemView.bind(this)}
                      action={(clear,loadMore,size,first)=>{
                          if(first){
                              loadMore();
                          }
                      }}
            />);
        return this.Help.app_render(this,div);
    }


    loadData(callparms) {
        var param={
            pc: 50,
            p:callparms.pageIndex,
        };
        var successCallback = (code, message, json,option)=> {
            callparms.success(json);
            callparms.finish(true);
            // if(option.option.isfinal==1){
            //     callparms.finish(true);
            // }
        };
        var failCallback = (code, message,option)=> {
            callparms.error(code+message);
            callparms.finish(true);
            // if(option.option.isfinal==1){
            //     callparms.finish(true);
            // }
        };
        HttpTool.post(APIGYW.api_passenger_getMyTrips, successCallback, failCallback,param);
    }

    getItemView(data, position){
        return (<RowItem key={position} Help={this.Help} data={data}/>);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;


class  RowItem extends Component{
    constructor(props){
        super(props);
        this.Help = this.props.Help;
        this.state = {
            upData:0,
        };
        this.img_label = window.imgHost + '/images/bg_label.png';
    }

    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }
    render() {
        var {data}=this.props;
        var itemView = (
            <div className={css.row} onClick={()=>{
                this.skipView(data);
            }}>
                <ItemTripDetail  data = {data}/>
                <div className={css.cell}>
                    <div className={css.state}>
                        <div className={css.rowContent} style={{
                            backgroundImage: this.Help.getImgUrl(this.img_label)
                        }}>{this.myType(data.trip.status)}</div>
                        <div className={css.date}>
                            {data.trip.create_time?TimeHelp.getYMDHM(data.trip.create_time):""}
                        </div>
                    </div>
                </div>
            </div>
        );
        return itemView;
    }
    exitMoney(data){
        var param={
            trip_id:data.trip.id,
        };
        var successCallback = (code, message, json,option)=> {
            Toast.showToast(message);
            data.trip.status=json;
            this.upView();
        };
        var failCallback = (code, message,option)=> {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_passenger_refundTrip, successCallback, failCallback,param);
    }
    skipView(data){
        let index = data.trip.status;
        var po = {
            flight:data,
            route_id:data.trip.route_id,
            trip_id:data.trip.id,
        }
        switch (index){
            case 1: case 2 : case 4: case 5 :{
            this.Help.app_open(this, "/PrePay", {
                title:this.myType(index),
                postValue:po,
                callBack:(status)=>{
                    if (status&&status>0){
                        data.trip.status = status;
                        this.upView();
                    }
                }
            });
        }
            break;
            default : {
                this.Help.app_open(this, "/TripDetail", {
                    title:this.myType(index),
                    data:data,
                    isTrip:true,
                    callBack:(status)=>{
                        data.trip.status = status;
                        this.upView();
                    }
                });
            }
                break;
        }
    }
    myType(type){
        var myType = "";
        switch (type){
            case 1: case 2 : {
            myType = "待付订金";
        }
            break;
            case 3 : {
                myType = "已付订金";
            }
                break;
            case 4 : case 5 : {
            myType = "待付尾款";
        }
            break;
            case 6 : {
                myType = "待出票";
            }
                break;
            case 81 : case 82 : case 83 : {
            myType = "已失效";
        }
            break;
            case 7 : {
                myType = "完成";
            }
                break;
            default : {
                myType = "已失效";
            }
                break;
        }
        return myType;
    }
}
RowItem.contextTypes = {
    router: React.PropTypes.object
}