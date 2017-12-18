/**
 * Created by apin on 2017/5/25.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './OrderDetail.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import ItemTripDetail from '../../cell/ItemTripDetail.js';
import ItemTicketInfor from '../../cell/ItemTicketInfor.js';
import ItemOrderPrice from '../../cell/ItemOrderPrice.js';
// import HttpTool from '../../http/HttpTool.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.isPaySuccess = false;
        this.state = {
            upData:0,
        }
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
            div = (<div className={css.main}>
                <ScrollDivV className={this.isPaySuccess?css.refContent:css.content}>
                    <div className={css.desc}>
                        {this.isPaySuccess?"订金支付失败，订单会保留15分钟，请及时完成支付":"订金支付成功"}
                    </div>
                    {/*<ItemTripDetail item={this.data}/>*/}

                    <ItemOrderPrice data={this.data}/>

                    <ItemTicketInfor ticketInforAct={()=>{
                        alert("起航小贴士");
                    }}/>



                </ScrollDivV>
                <div className={this.isPaySuccess?css.refBottom:css.bottom} onClick={()=>{
                    alert("重新支付");
                    this.Help.app_open(this, "/PrePay", {
                        title:"航程明细",
                    });
                }}>
                    重新支付
                </div>
            </div>);
        }
        return this.Help.app_render(this,div);
    }
    //请求详情页数据
    loadNet(){
        //this.showLoad();
        var param={

        };
        var successCallback = (code, message, json,option)=> {
            if(code==1){
                this.closeLoad();

                this.upView();
            }else{
                this.showError(code,message);
                this.showToast(message,"black");
            }
        };
        var failCallback = (code, message)=> {
            this.showError(code,message);
            this.showToast(message,"black");
        };
        // HttpTool.post( HttpTool.APIGYW.user_getinfo, successCallback, failCallback,param);

        //this.closeLoad();
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
            orderNum:"123456789012345678",
        }
        this.upView();
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;