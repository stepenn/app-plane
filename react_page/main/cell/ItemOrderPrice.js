/**
 * Created by apin on 2017/5/29.
 */
import React, {Component} from 'react';
import css from './ItemOrderPrice.less';
import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Toast from '../../component/Toast/index.js';
import SelectAlert from '../../component/Dialog/Select/index.js'

class ItemOrderPrice extends Component {
    constructor(props){
        super(props);
        this.state=({
            upData:0,
        })
        this.img_delBG = window.imgHost + '/images/bg_delete.png';
    }
    upView(){
        this.setState({
            upData:this.getState.upData +1,
        })
    }
    render() {
        var {data,isTrip,isShow,callBack} = this.props;
        var isShowBtn = isShow&&data&&data.status==3;
        var itemView = (<div {...this.props} className={css.infor}>
                <div className={css.orderInfor}>
                    <div className={isShowBtn?css.refLeftTitle:css.leftTitle}>订单信息</div>
                    <div className={isShowBtn&&isTrip ? css.exit : css.hidden}
                        style={{
                            backgroundImage: `url(${this.img_delBG})`
                        }} onClick={()=>{
                             SelectAlert.open((yes)=>{
                                 this.selectYes = yes;
                             },{
                                 title:"温馨提示",
                                 content:"确定撤退?",
                                 isShow:true,
                             },()=>{
                                 //关闭之后
                                 if(this.selectYes){
                                     //关闭页面 并进行操作
                                     this.exitMoney(data);
                                 }else{
                                     //
                                 }
                             });
                    }}>撤退</div>
                </div>
                <div className={css.orderInfor}>
                    <div className={css.leftTitle}>订单号 :</div>
                    <div className={css.rightTitle}>{data.id?data.id:""}</div>
                </div>
                <div className={css.orderInfor}>
                    <div className={css.leftTitle}>订单金额 :</div>
                    <div className={css.rightTitle}>{data.total_amount?"¥ "+data.total_amount:"暂无"}</div>
                </div>
            </div>);
        return itemView;
    }
    exitMoney(data){
        var param={
            trip_id:data.id,
        };
        var successCallback = (code, message, json,option)=> {
            data.status = json;
            if (this.props.callBack){
                this.props.callBack(json);
            }
            this.upView();
        };
        var failCallback = (code, message,option)=> {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_passenger_refundTrip, successCallback, failCallback,param);
    }
}
module.exports = ItemOrderPrice;