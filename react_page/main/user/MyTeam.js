/**
 * Created by apin on 2017/6/8.
 */
import React, {Component} from 'react';
import HelpI from '../../help/Help.js';
import css from './MyTeam.less';
import ListView from '../../component/ListView/ListView.js';
import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Toast from '../../component/Toast/index.js';
import CookieHelp from '../../tool/CookieHelp.js'
import TimeHelp from '../../tool/TimeHelp.js';
import ClickHelp from '../../tool/ClickHelp.js';

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.userInfor = CookieHelp.getUserInfo();
        this.isBack = this.Help.app_getParameter(this).isBack;
        this.state = {
            isScroll:false,
            title:"",
            btnTitle:"",
        }
        this.img_huizhang = window.imgHost + '/images/huizhang.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
    }
    render() {
        var div = (
            <div className={css.main}>
                <div className={css.headArea}>
                    <div className={css.headImg} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_huizhang)
                    }}></div>
                    <div className={css.headTitle} >{this.state.title}</div>
                </div>
                <ListView className={css.content}
                          getListData={this.loadData.bind(this)}
                          getItemView={this.getItemView.bind(this)}
                          scrollStart={()=>{
                              this.setState({
                                  isScroll:true,
                              })
                          }}
                          scrollEnd={()=>{
                              this.setState({
                                  isScroll:false,
                              })
                          }}
                          action={(clear,loadMore,size,first)=>{
                              if(first){
                                  this.loadMore = loadMore;
                                  this.clear = clear;
                                  loadMore();
                              }
                          }}
                />
                <div className={((this.state.title!="")&&!this.state.isScroll&&!this.isBack)? css.btmSubmit : css.hidden} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_submit)
                }} onClick={()=>{
                    this.Help.app_open(this,"/PublicTeamTrip",{
                        title:"发布泡泡",
                        callBack:(isFinish)=>{
                            if (isFinish){
                                if (this.clear) {
                                    this.clear();
                                }
                                if (this.loadMore) {
                                    this.loadMore();
                                }
                            }
                        }
                    })
                }}>{this.state.btnTitle}</div>
            </div>
        );
        return this.Help.app_render(this,div);
    }


    loadData(callparms) {
        var param={
            dataType:1,
            pc: 100,
            p:callparms.pageIndex,
        };
        var successCallback = (code, message, json,option)=> {
            if (callparms.pageIndex==1&&json.length<1){
                this.setState({
                    title:"近期暂无领队计划",
                    btnTitle:"马上去开团",
                })
            }else {
                this.setState({
                    title:"领队计划",
                    btnTitle:"再领一队",
                })
            }
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


class RowItem extends Component{
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
        });
    }
    render() {
        var {data}=this.props;
        if(!data){
            data = {trip:{},journeys:[{},{}]};
        }
        if (!data.trip){
            data.trip = {};
        }
        log(data.trip)
        return (<div className={css.cell} onClick={(e)=>{
            ClickHelp.stopClick(e)
            this.Help.app_open(this, "/TripDetail",{
                title:"行程详情",
                isTrip:false,
                data:data,
                callBack:(myItem)=>{

                }}
            )
        }}>
            <ItemTripTotal item = {data.trip}/>
            <div className={css.cellCon}>
                <div className={css.line}>
                    <span style={{fontSize:"0.35rem"}}>{data.trip.total_amount?(" 总价: ¥ "+data.trip.total_amount+" "):""}</span>
                    <span style={{fontSize:"0.35rem"}}>单价: </span>
                    <span style={{fontSize:"0.5rem",bold:"900"}}>{"¥ " + data.trip.adult_price}</span>
                    <span style={{fontSize:"0.35rem"}}> 封顶</span>
                </div>
                {this.createItem(data.journeys,data.trip.adult_price)}
                <div className={css.row}>
                    <div className={css.leftText}>
                        <span style={{fontSize:"0.35rem"}}>目前人员</span>
                        <span style={{fontSize:"0.5rem"}}>{data.trip.member_count}</span>
                        <span style={{fontSize:"0.35rem"}}>人</span>
                    </div>
                    <div className={css.rowBtn} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_label)
                    }} onClick={(e)=>{
                        ClickHelp.stopClick(e);
                        var trip = data.trip;
                        var postValue = {
                            images:trip.images?JSON.stringify(trip.images):null,
                            memo:trip.memo,
                            title:trip.title,
                        };
                        this.Help.app_open(this, "/Siege",{
                            title:"招募令",
                            route_id:trip.route_id,
                            postValue : postValue,
                            callBack:(myItem)=>{
                                trip.images = myItem.images?JSON.parse(myItem.images.split(",")):null;
                                trip.memo = myItem.memo;
                                trip.title = myItem.title;
                                data.trip = trip;
                            }})
                    }}>编辑招募令</div>
                    <div className={css.rowBtn} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_label)
                    }} onClick={(e)=>{
                        ClickHelp.stopClick(e)
                        this.Help.app_open(this, "/Employees",{
                            to_city_name:data.trip?data.trip.to_city_name:"",
                            title:"我的队员",
                            id:data.trip.route_id,
                            callBack:(myItem)=>{

                            }}
                        )
                    }}>查看队员</div>

                    <div className={css.rowBtn} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_label)
                    }} onClick={(e)=>{
                        ClickHelp.stopClick(e)
                        this.skipView(data);
                    }}>{this.myType(data.trip.status)}</div>
                </div>
            </div>
        </div>);
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


    createItem(data,price){
        if(!data){
            return<div></div>
        }
        var itemArr = [];
        for (let i=0;i<data.length;i++){
            let item = data[i];
            var div = (<ItemJourneys key={i} item={item} price={price}/>);
            itemArr.push(div);
        }
        return itemArr;
    }
}
RowItem.contextTypes = {
    router: React.PropTypes.object
}

class ItemJourneys extends Component {
    constructor(props){
        super(props);
        this.icon_start = window.imgHost + '/images/start.png';
        this.icon_end = window.imgHost + '/images/end.png';
    }
    render() {
        var {item,price}=this.props;
        if (!item){
            return (<div></div>);
        }
        var goDate = TimeHelp.getMD(item.depart_time);
        var goWeek = TimeHelp.getWeek(item.depart_time);
        var goStartTime = TimeHelp.getHM(item.depart_time);
        var goEndTime = TimeHelp.getHM(item.dest_time);
        var itemView = (
            <div>
                <div className={css.row}>
                    <div className={css.leftText}>{item.flight_no}</div>
                    <div className={css.rightText}>{goDate+"("+"周"+ goWeek+")"}</div>
                    <div className={css.refRightText}>{goStartTime+"-"+goEndTime}</div>
                    <img className={css.showImg}
                         src={item.trip_number==1?this.icon_start:this.icon_end}/>
                </div>
            </div>
        );
        return itemView;
    }
}
ItemJourneys.contextTypes = {
    router: React.PropTypes.object
}

class ItemTripTotal extends Component {
    constructor(props){
        super(props);
    }
    render() {
        var {item}=this.props;
        if (!item){
            return (<div></div>);
        }
        var itemView = (<div className={css.totalCell}>
            <div {...this.props} className={css.totalRow}>
                <div className={css.left}>
                    <span className={css.font_big}>{item.from_city_name}</span>
                </div>
                <div className={css.center}>{item.daynight?(item.daynight.replace(",","天")+"晚"):"天数待定"}</div>
                <div className={css.right}>
                    <span className={css.font_big}>{item.to_city_name}</span>
                </div>
            </div>
            <div className={css.refTotalRow}>
                <div className={css.font_small}>出发</div>
                <div className={css.refFont_small}>返回</div>
            </div>
        </div>);
        return itemView;
    }
}
ItemTripTotal.contextTypes = {
    router: React.PropTypes.object
}