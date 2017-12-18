/**
 * Created by apin on 2017/5/25.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './PrePay.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import ItemTripDetail from '../../cell/ItemTripDetail.js';
import ItemPayClicked from "../../cell/ItemPayClicked.js";
import HttpTool from '../../../http/HttpTool.js';
import APISP from '../../../http/APISP';
import Loading from '../../../component/Dialog/Loading/index.js';
import Toast from '../../../component/Toast/index';
import ItemTicketInfor from '../../cell/ItemTicketInfor.js';
import ItemTripShowPerson from '../../cell/ItemAddPerson.js';
import Share from '../../../component/Dialog/Share/Share.js';
import CookieHelp from '../../../tool/CookieHelp.js';

import AudioHelp from '../../../tool/AudioHelp';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.audio = new AudioHelp('PrePay');
        this.isRead = true;
        this.state = {
            message:"小拼正在飞速加载中...",
            show:false,
            type:1,//	1=定金 2=尾款
        }
        this.img_battleTitle = window.imgHost + '/images/battle_title.png';
        this.img_input = window.imgHost + '/images/bg_label.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
    }

    upView(){

    }

    animEnter(){
        this.postValue =  this.Help.app_getParameter(this).postValue;

        // var pa = {
        //     adult_count: "1",
        //     child_count: "1",
        //     daynight: "6,5",
        //     depart_city_code: "HGH",
        //     dest_city_code: "BKK",
        //     time_policy: 2,
        //     yyyymm: "201705",
        // };
        // this.postValue = pa;

        //如果是发布,数据进行组装
        if(!this.postValue){
            this.postValue = {}
        }
        if(!this.postValue.flight){
            this.postValue.flight = {};
        }
        if(!this.postValue.flight.trip){
            this.postValue.flight.trip = {};
        }
        if(this.postValue.adult_count){
            this.postValue.flight.trip.adult_count = this.postValue.adult_count;
            this.postValue.flight.trip.child_count = this.postValue.child_count;
        }


        this.getTripAmount(this.postValue);


    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    render() {
        var main =  <div className={css.css_layout_none}>{this.state.message}</div>;



        if(this.state.show){
            var selectView = null;
            if(this.state.type==1) {
                selectView = (
                    <div className={css.row}>

                        <div className={css.cell}>
                            <div className={css.cellLeft} style={{
                                backgroundImage: this.Help.getImgUrl(this.img_input)
                            }}>联系人</div>
                            <div className={css.cellRight}>
                                <input ref={"userName"} className={css.input} defaultValue={this.postValue.flight.trip.userName} placeholder="请输入联系人姓名"/>
                            </div>

                        </div>
                        <div className={css.cell}>
                            <div className={css.cellLeft} style={{
                                backgroundImage: this.Help.getImgUrl(this.img_input)
                            }}>手机号</div>
                            <div className={css.cellRight}>
                                <input ref={"userPhone"} className={css.input}  defaultValue={this.postValue.flight.trip.userPhone} placeholder="用于接收确认短信"/>
                            </div>
                        </div>

                    </div>
                )
            }
            else{
                selectView = (
                    <ItemTripShowPerson
                        obj={(obj)=>{
                            this.showPerson = obj;
                        }}
                        Help={this.Help}
                    />
                );
            }

            var trip = this.postValue&&this.postValue.flight?this.postValue.flight:{};
            var myTrip = trip.trip?trip.trip:{};


            // var adultPrice = parseInt(myTrip.adult_price?myTrip.adult_price:0);
            // var adultCount = parseInt(myTrip.adult_count?myTrip.adult_count:0);
            // var childPrice = parseInt(myTrip.child_price?myTrip.child_price:0);
            // var childCount = parseInt(myTrip.child_count?myTrip.child_count:0);
            // var totalAmount = adultPrice*adultCount+childPrice*childCount;
            // var totalAmountStr = totalAmount==0?"":" 总价: "+totalAmount+" 元 ";
            // log(JSON.stringify(myTrip));
            // var total_amount = myTrip.total_amount?" 总价: "+(myTrip.total_amount)+" 元 ":"";
            main = (
                <div>
                    <div className={css.headAreaLayout} style={{display:"none"}}>
                        <div className={css.headArea} style={{
                            backgroundImage: this.Help.getImgUrl(this.img_battleTitle)
                        }}>
                            <div className={css.title}>粮饷</div>
                            <div className={css.headRow}>
                                <div className={css.headSmallTitle}>预拨</div>
                                <img className={css.headSmallImg}/>
                                <div className={css.headSmallTitle}>尾款</div>
                                <img className={css.headSmallImg}/>
                                <div className={css.headSmallTitle}>出票</div>
                            </div>
                        </div>
                    </div>
                    <ItemTripDetail data={this.postValue.flight}
                                    isPayShowClicked={false}
                                    noShowTotalPrice={true}
                    />


                    <div className={css.row}>
                        <div className={css.people}>
                            {this.state.message}
                        </div>
                    </div>

                    <ItemTicketInfor className={css.marginTop}
                                     isRead={this.isRead}
                                     isReadCallBack={(isRead)=>{
                                         this.isRead = isRead;
                                     }}
                                     setSwitch={(fun)=>{
                                         this.setSwitch = fun;
                                     }}
                                     ticketInforAct={()=>{
                                         this.Help.app_open(this,"/TicketInforDesc",
                                             {
                                                 isRead:this.isRead,
                                                 title:"起航小贴士",
                                                 callBack:(isFinish)=>{
                                                     this.isRead = isFinish==1?true:false;
                                                     this.setSwitch(this.isRead);
                                                 }
                                             });
                                     }}/>
                    {selectView}
                    <ItemPayClicked

                        getPayObj={(obj)=>{
                            this.payObj = obj;
                        }}
                    />

                    <div className={css.submit} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_submit)
                    }} onClick={()=>{
                             this.submit();
                         }}>立即支付
                    </div>
                    <br/>
                </div>
            )
        }
        var div = (
            <div>
                <ScrollDivV className={css.main}>
                    {main}
                </ScrollDivV>
                <ShareView
                    action={(obj)=>{
                        this.ShareView = obj;
                    }}
                />
            </div>
        );
        return this.Help.app_render(this,div);
    }
    submit(){
        if(this.payObj){
            this.payObj.verClient(()=>{
                this.submitHttp();
            },(e)=>{
                Toast.showToast(e.message);
            })
        }else{
            this.submitHttp();
        }

    }
    submitHttp(){
        // if(1==11){
        //     Toast.showToast("模拟支付成功:");
        //     this.Help.setIntent(6);
        //     this.Help.back(this);
        //     this.openShare({code:1,shareUrl:"http://app.apin.com"})
        //     return;
        // }

        // Toast.showToast("模拟支付成功:");
        // this.Help.setIntent(6);
        // this.Help.back(this);
        // return;

        if(!this.isRead){
            Toast.showToast("请阅读起航小贴士");
            return;
        }



        //如果是付尾款 ,验证乘机人是否数量相同
        if(this.state.type==1){
            this.postValue.userName = this.refs["userName"].value;
            this.postValue.userPhone = this.refs["userPhone"].value;

        }else{
            var data = this.showPerson.getSelectData();
            if(this.postValue.flight.trip.adult_count!=data.adult_count||
                this.postValue.flight.trip.child_count!=data.child_count){
                Toast.showToast("乘机人数量不匹配");
                return;
            }
            this.postValue.passengers = data.id;
        }
        var successBack = (json)=>{
            //支付完成
            Loading.show(false, () => {
                if (this.state.type == 1) {
                    //dingjing
                    this.audio.play('Order', () => { this.audio.play('ShareAfterOrder') });
                } else { 
                    //weikuan
                     this.audio.play('Finish');
                }
               
                Toast.showToast("支付成功");
                this.openShare(json);

            });

        };
        var errorBack = (error)=>{

            Loading.show(false,()=>{

                Toast.showToast(error.message);
                // if(error.code ==9999993){
                //
                // }else{
                //
                // }

            });
        };

        var exe = (id)=>{
            //拉取当前选择的支付订单
            if(this.payObj){
                this.payObj.openPay(successBack,errorBack, {
                    trip_id: id,//行程报名id	string
                    pay_type: this.state.type,//	订单类型: 1-定金 2-尾款 3-全款 11-退定金 12-退尾款 13-退全款	string
                });
            }
        }
        Loading.show(true);

        //上传成功.不再上传
       if(this.upLoadSuccess){
           exe(this.upLoadSuccessID);

       }else{
           this.upLoadData(this.postValue,(id)=>{
               // Toast.showToast("已加入队伍,请支付粮响","green","white");
               this.upLoadSuccess = true;
               this.upLoadSuccessID = id;

               setTimeout(()=>{
                   exe(id);
               },1000)

           },(error)=>{
               errorBack(error);
           });
       }

    }

    openShare(json){

//         主标题：xxx已经加入xxx（地）拼机的路上。
// 副标题：如果幸福不在路上，那就在路的尽头。
        var data = this.postValue.flight;
        var content = "来自驴友的行程";
        var c_title = "来一场说走就走的旅行";
        if(data){

            // var c_time = data.trip.daynight?(data.trip.daynight.replace(",","天")+'晚'):"";
            // var f_t =  data.trip.from_city_name + "-"+ data.trip.to_city_name;
            // content = "来一场"+f_t +"  "+c_time+"说走就走的旅行";
            //

            //
            // c_title = "行程 "+f_t+"  领队:"+userInfo.nick_name;
            var userInfo = CookieHelp.getUserInfo();
            c_title = userInfo.nick_name+"已经加入"+data.trip.to_city_name+"拼机的路上"
            content = "如果幸福不在路上，那就在路的尽头。"

        }
        this.Help.setIntent(json.code);
        if (this.ShareView) {
            this.isBack = false;
            this.ShareView.setListen((yes)=>{
                //关闭之后
                if(this.isBack){
                    return;
                }
                this.isBack = true;
                this.audio.stop();
                this.Help.back(this);

            })
            this.ShareView.setOption({
                title:c_title,
                content:content ,
                href: json.shareUrl,
            })
            this.ShareView.show(true)
        } else {
            this.audio.stop();
            this.Help.back(this);
        }
    }

    /**
     * 发布行程/加入行程
     */
    upLoadData(param,successBack,errorBack){


        var successCallback = (code, message, json, option) => {

            successBack(json);
        };
        var failCallback = (code, message) => {
            errorBack({code:code,message:message});
        };
        var api = null;
        if(this.state.type==1){
            api = param.route_id?APISP.api_route_joinRoute:APISP.api_route_publishRoute;
        }else{
            api =  APISP.api_route_saveTripPassengers;
        }
        HttpTool.post(api, successCallback, failCallback, param);
    }
    /**
     * 发布行程/加入行程
     */
    getTripAmount(param){


        var successCallback = (code, message, json, option) => {
            // successBack(json);
            // amount	应付金额	string
            // type	1=定金 2=尾款	number

            this.setState({
                message:(json.total_amount?" 总价: "+(json.total_amount)+" 元 ":"") +"待付" +(json.type==1?"订金: ":"尾款: ")+json.amount+" 元",
                show:true,
                type:json.type,
            })
        };
        var failCallback = (code, message) => {
            this.setState({
                message:message,
                show:false,
            })
        };
        HttpTool.post(APISP.api_pay_getTripAmount, successCallback, failCallback, param);
    }
}


class ShareView extends Component{
    constructor(props){
        super(props);
        this.state = {
            show:false,
        }
        if(this.props.action){
            this.props.action(
                {
                    show:this.show.bind(this),
                    setListen:this.setListen.bind(this),
                    setOption:this.setOption.bind(this),
                }
            );
        }
        if(this.props.select){

        }
    }
    setOption(option){
        if(option){
            this.option = option;
        }
    }
    setListen(callBack){
        if(callBack){
            this.callBack = callBack;
        }
    }
    show(show){
        this.setState({
            show:show,
        });


    }
    back(yes){
        if(this.props.select){
            this.props.select(yes);
        }
        if(this.callBack){
            this.callBack(yes);
        }
    }
    render(){
        var style = {}
        if(!this.state.show){
            style = {display:"none"};
        }
        return(
            <div style={style}>
                <Share
                    option={ this.option?this.option:{}}
                    callBack={(yes) => {
                        //分享成功,不再通知
                       this.back(yes);
                    }}
                    onCancel={()=>{
                        this.back(false);
                        this.show(false);
                    }}
                />
            </div>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;