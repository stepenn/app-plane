/**
 * Created by apin on 2017/5/24.
 */
import React, {Component} from 'react';
import css from './ItemTripDetail.less';
import TimeHelp from '../../tool/TimeHelp.js'
import SwitchBtn from '../public/Switch/index.js';

/*
*data 传进来的数据
*isPayShowClicked 判断时候显示选择点击按钮
* noShowTotalPrice 是否显示总价 true不显示 define或false显示
* showMoney 是否显示预期价格 true显示 define或false不显示
*/
class index extends Component {
    constructor(props){
        super(props);
    }

    render(){
        var {data,isPayShowClicked,noShowTotalPrice,showMoney}=this.props;
        if(!data){
            data = {trip:{},journeys:[{},{}]};
        }
        if (!data.trip){
            data.trip = {};
        }
        var priceBool = true;
        var price = "";
        if(showMoney){
            priceBool= !data.trip.adult_price&&!data.trip.child_price
            var adult_price = data.trip.adult_price?("成人 ￥"+data.trip.adult_price):"";
            var child_price = data.trip.child_price?("  儿童 ￥"+data.trip.child_price):"";
            price = "预计单价: "+adult_price+ child_price;
        }
        var adult_count = data.trip.adult_count>0?(data.trip.adult_count+"/成人"):"";
        var child_count = data.trip.child_count>0?(data.trip.child_count+"/儿童"):"";
        var num = "同行人数: "+adult_count+ " "+child_count;
        var total_amount = data.trip.total_amount?(" 总价: "+data.trip.total_amount+" 元"):"";

        var numBool = !data.trip.adult_count&&!data.trip.child_count;
        var bottomView = (
            <div>
                <div className={!isPayShowClicked&&priceBool?css.hidden:css.priceLine}>
                    <div className={isPayShowClicked?css.selectImg:css.hidden}>
                        <SwitchBtn noClick={true}/>
                    </div>
                    <div className={priceBool?css.hidden:css.priceTitle}>{price}</div>
                </div>
                <div className={numBool?css.hidden:css.priceLine}>
                    <div className={numBool?css.hidden:css.priceTitle}>{num}</div>
                </div>
                <div className={noShowTotalPrice?css.hidden:css.priceLine}>
                    <div className={css.priceTitle} style={{marginTop: 0,fontSize:"0.35rem"}}>{total_amount}</div>
                </div>
            </div>
        );
        if(data.journeys){
            return (
                <div className={css.full}>
                    <ItemTripTotalTime item = {data.trip}/>
                    <RowItem item = {data.journeys}/>
                    {bottomView}
                </div>
            );
        }else{
            return (
                <div  className={css.full}>
                    <ItemTripTotal item = {data.trip}/>
                    {bottomView}
                </div>
            );
        }

    }
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
        var itemView = (<div>
            <div {...this.props} className={css.row}>
                <div className={css.left}>
                    <span className={css.font_big}>{item.from_city_name}</span>
                </div>
                <div className={css.center}>{item.daynight?(item.daynight.replace(",","天")+"晚"):"天数待定"}</div>
                <div className={css.right}>
                    <span className={css.font_big}>{item.to_city_name}</span>
                </div>
            </div>
            <div className={css.refRow}>
                <div className={css.font_small}>出发</div>
                <div className={css.refFont_small}>返回</div>
            </div>
        </div>);
        return itemView;
    }
}
class ItemTripTotalTime extends Component {
    constructor(props){
        super(props);
    }
    render() {
        var {item}=this.props;
        if (!item){
            return (<div></div>);
        }
        var itemView = (<div>
            <div {...this.props} className={css.row}>
                <div className={css.left}>
                    <span className={css.font_big}>{item.depart_time?TimeHelp.getMD(item.depart_time):""}</span>

                </div>
                <div className={css.center}>{item.daynight?(item.daynight.replace(",","天")+"晚"):"天数待定"}</div>
                <div className={css.right}>
                    <span className={css.font_big}>{item.depart_time?TimeHelp.getMD(item.dest_time):""}</span>

                </div>
            </div>
            <div className={css.refRow}>
                <div className={css.font_small}>出发</div>
                <div className={css.refFont_small}>返回</div>
            </div>
        </div>);
        return itemView;
    }
}

class RowItem extends Component{
    constructor(props) {
        super(props);
        this.img_start = window.imgHost + '/images/start.png';
        this.img_end = window.imgHost + '/images/end.png';
    }
    render() {
        var {item}=this.props;
        var itemView = (
            <div {...this.props}>
                {this.createTripItem(item)}
            </div>
        );
        return itemView;
    }

    createTripItem(arr){
        if (!arr||arr.length<1){
            return (<div></div>);
        }
        var itemArr = [];
        for(let i=0;i<arr.length;i++){
            var item = arr[i];
            var nTime = item.dest_time - item.depart_time;
            nTime = nTime/1000;
            var day = nTime/(3600*24);
            var hour = parseInt((nTime%(3600*24))/3600);
            var minute = (nTime%3600)/60;

            // log("--------===="+item.dest_time)
            // log("--------===="+item.depart_time)
            // log("--------===="+nTime)
            // log("--------===="+day)
            // log("--------===="+hour)
            // log("--------===="+minute)
            // log("gyw ---------------")
            var time = "";
            if(day>1){
                time = day+"天";
            }
            if(hour>1){
                time = time +hour+"时";
            }
            if(minute>1){
                time = time +minute+"分";
            }
            var item = (<div className={css.cellArea} key={i}>
                <div className={css.goLeft}>
                    <img className={css.img}
                         src={item.trip_number==1?this.img_start:this.img_end}/>
                </div>
                <div className={css.goRight}>
                    <div className={css.title}>{item.flight_no}</div>
                    <div className={css.timeCell}>
                        <div className={css.leftCell}>{TimeHelp.getHM(item.depart_time)}</div>
                        <div className={css.centerCell}>{time}</div>
                        <div className={css.rightCell}>{TimeHelp.getHM(item.dest_time)}</div>
                    </div>
                    <div className={css.timeCell}>
                        <div className={css.refLeftCell}>{item.depart_city}</div>
                        <div className={css.refrightCell}>{item.dest_city}</div>
                    </div>
                    <div className={css.timeCell}>
                        <div className={css.thirLeftCell}>{item.depart_airport}</div>
                        <div className={css.thirRightCell}>{item.dest_airport}</div>
                    </div>
                </div>
            </div>);
            itemArr.push(item);
        }
        return itemArr;
    }
}
module.exports = index;