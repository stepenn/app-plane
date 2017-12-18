/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
/**
 * 测试支付的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state = {upData:0}
    }

    upView(){
        this.setState({
            upData : this.state.upData+1,
        });
    }


    openPay(c){
        // 必须从业务服务器获取支付信息
        var statement = "app_id=2017052607353391&biz_content=%7B%22timeout_express%22%3A%2215m%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%2C%22total_amount%22%3A0.01%2C%22subject%22%3A%22%E8%BF%99%E6%98%AF%E8%AE%A2%E5%8D%95%E6%A0%87%E9%A2%98%22%2C%22body%22%3A%22%E8%BF%99%E6%98%AF%E8%AE%A2%E5%8D%95%E6%8F%8F%E8%BF%B0%22%2C%22out_trade_no%22%3A%222017052809001557370315696%22%7D&charset=utf-8&format=json&method=alipay.trade.app.pay&notify_url=http%3A%2F%2Fmyetc.iask.in%2Fnotfiy%2Falinotfiy&sign=L0xmdKIY%2BiA7mmpJ71SpuktFGd9gGiLBsMCEwEXHxOomBw6lV19x8CVlKs8aFp69mq3uacZMS28JNskWtXOiiValvOaHeYunPDZw8fC%2BQNbojlRPsq35OcRo3lFRyc0LeW0TdKhBW%2BMrHYqazFpp%2BYKUhkXm0kOdG9tvd1%2FYjTk%3D&sign_type=RSA&timestamp=2017-05-28%2009%3A00%3A15&version=1.0";
        alert(statement);
        plus.payment.request(c, statement, ()=>{
            alert("支付操作成功！");
        }, (e)=>{
            alert("支付失败："+e.message);
        } );
    }
    getPayList(){
        if(!window.plus){
            alert("请在APP中打开");
        }
        alert("得到支付列表");
        plus.payment.getChannels((s)=>{
            this.viewS = [];
            for(let i in s){
                let obj = s[i];
                this.viewS.push(
                    <div
                        key={i}
                        style={{fontSize:"1rem",color:"#ff00ff"}}
                        onClick={()=>{
                        this.openPay(obj);
                    }}>
                        {"支付通道描述:"+obj.description}
                    </div>
                )
                this.upView();
            }
        }, (e)=>{
            alert("获取支付通道列表失败："+e.message);
        });
    }
    render() {
        var div = (
            <div >
                <div>
                    <div>这是支付页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div style={{fontSize:"1rem"}} onClick={()=>{

                        this.getPayList();


                    }}>获取可支付列表</div>
                    {this.viewS}
                </div>


            </div>
        );
        return this.Help.app_render(this,div,{full:false});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;