/**
 * Created by apin on 2017/5/24.
 */
import React, {Component} from 'react';
import css from './ItemPayClicked.less';
import Switch from '../public/Switch/index.js';
import HttpTool from '../../http/HttpTool.js';
import APILXF from '../../http/APILXF.js';

class ItemPayClicked extends Component {
    constructor(props){
        super(props);
        this.img_default = window.imgHost + ("/images/img_tick.png");
        this.payList  = [];
        this.payList.push({
            use:true,
            title:"微信",
            desc:"微信支付",
            type:"WECHAR",
            icon:window.imgHost + ("/images/pay_wechat.png"),
            order:null,
        });
        this.payList.push({
            use:true,
            title:"支付宝",
            desc:"支付宝支付",
            type:"ALIPAY",
            icon:window.imgHost + ("/images/pay_ali.png"),
            order:null,
        });

        this.state = ({
            index:0,
        })
        if(this.props.getPayObj){
            this.props.getPayObj({
                openPay:this.openPay.bind(this),
                getSelect:this.getSelect.bind(this),
                verClient:this.verClient.bind(this),
            });
        }
    }
    getSelect(){
        return this.payList[this.state.index];
    }

    verClient(successBack,errorBack){
        let type =  this.getSelect().type;
        plus.payment.getChannels((s)=>{
            var channel = null;
            for(let i in s){
                let obj = s[i];
                //"alipay" - 表示支付宝； "wxpay" - 表示微信支付； "appleiap" - 表示苹果应用内支付； "qhpay"
                // ALIPAY
                if(type=="WECHAR"&& obj.id == "wxpay"){
                    // 微信支付
                    channel = obj;
                }else {
                    if(type=="ALIPAY"&& obj.id == "alipay"){
                        // 微信支付
                        channel = obj;
                    }
                }
            }
            if(channel){
                if (channel.serviceReady) {
                    successBack();
                } else {
                    errorBack({code: -9999993, message: "未安装" + channel.description + "客户端!"});
                }
            }else{
                errorBack({code:-9999993,message:"不支持"+pay.desc+"支付!"});
            }
        }, (e)=>{
            errorBack({code:-9999993,message:"获取支付通道列表失败："+e.message});
        });
    }
    /**
     *
     * @param successBack
     * @param errorBack
     * @param option
     * option.trip_id	行程报名id	string
     * option.pay_type	订单类型: 1-定金 2-尾款 3-全款 11-退定金 12-退尾款 13-退全款	string
     */
    openPay(successBack,errorBack,option){
       let obj =  this.getSelect();

       if(option){
           option.pay_way = obj.type;
       }
        if(obj.order){
            this.openNativeView(successBack,errorBack,obj,option);
        }else{
            this.getOrderNo({
                pay_way:obj.type,
                trip_id:option.trip_id,
                pay_type:option.pay_type,

            },(orderNo)=>{
                obj.order = orderNo;
                this.openNativeView(successBack,errorBack,obj,option);
            },(error)=>{
                if(errorBack){
                    errorBack(error);
                }
            });
        }
    }

    openNativeView(successBack,errorBack,pay,option){
        if(!window.plus){
            errorBack({code:-9999993,message:"请在APP中打开"});
            return;
        }
        plus.payment.getChannels((s)=>{
            this.viewS = [];
            var channel = null;
            for(let i in s){

                let obj = s[i];
                //"alipay" - 表示支付宝； "wxpay" - 表示微信支付； "appleiap" - 表示苹果应用内支付； "qhpay"

                // ALIPAY
                if(pay.type=="WECHAR"&& obj.id == "wxpay"){
                    // 微信支付
                    channel = obj;
                }else {
                    if(pay.type=="ALIPAY"&& obj.id == "alipay"){
                                        // 微信支付
                                        channel = obj;
                                    }
                }
            }

            if(channel){
                if (channel.serviceReady) {
                    plus.payment.request(channel, pay.order, () => {
                        this.getPayResult(option, successBack, errorBack);
                    }, (e) => {
                        // errorBack({code: -9999993, message: "支付失败：" + e.message});
                        errorBack({code: -9999993, message: "支付失败!"});
                    });
                } else {
                    errorBack({code: -9999993, message: "未安装" + channel.description + "客户端!"});
                }

            }else{
                errorBack({code:-9999993,message:"不支持"+pay.desc+"支付!"});
            }

        }, (e)=>{
            // errorBack({code:-9999993,message:"获取支付通道列表失败："+e.message});
            errorBack({code:-9999993,message:"获取支付通道列表失败!"});
        });
    }
    /**
     * 得到定单号
     */
    getOrderNo(param,successBack,errorBack){
        // pay_type	订单类型: 1-定金 2-尾款 3-全款 11-退定金 12-退尾款 13-退全款	string
        // pay_way	支付方式，ALIPAY或者WECHAR	string
        // trip_id	行程报名id	string

        var successCallback = (code, message, json, option) => {
            successBack(json);
        };
        var failCallback = (code, message) => {
            errorBack({code:code,message:message});
        };
        HttpTool.post(APILXF.api_pay_payTrip, successCallback, failCallback, param);
    }
    /**
     * 查询复核支付结果
     */
    getPayResult(param,successBack,errorBack){
        // pay_type	订单类型: 1-定金 2-尾款 3-全款 11-退定金 12-退尾款 13-退全款	string
        // trip_id	行程报名id	string

        var successCallback = (code, message, json, option) => {
            if(json==0){
                errorBack({code:code,message:message});
            }else{
                successBack(json);
            }

        };
        var failCallback = (code, message) => {
            errorBack({code:code,message:message});
        };
        HttpTool.post(APILXF.api_pay_queryPayResult, successCallback, failCallback, param);
    }

    setSelect(index){
        this.setState(
            {
                index:index,
            }
        );
    }


    render() {

        var viewS = [];
        for(let i in this.payList){
            let select = i==this.state.index;
            let obj = this.payList[i];
            viewS.push(
                <div
                    key={i}
                    className={css.payCell} onClick={()=>{
                    this.setState({
                        index:i,
                    });
                }}>
                    <div className={css.payImgLeft}>
                        <img className={css.payImg} src={obj.icon}/>
                    </div>
                    <div className={css.payImgRight}>{obj.title}</div>
                    <div className={css.payImgLeft}>
                        <Switch
                            noClick={true}
                            defaultSelect={select}
                            select={(select)=>{
                                if(select){
                                    //this.setSelect(i);
                                }
                            }}
                        />
                    </div>
                </div>

            )
        }
       ;
        var itemView = (
            <div>
                <div className={css.lineRow}>
                    <div className={css.lineTitle}>支付方式</div>
                    <div className={css.line}></div>
                    {viewS}
                </div>
            </div>
        );
        return itemView;
    }
}
module.exports = ItemPayClicked;