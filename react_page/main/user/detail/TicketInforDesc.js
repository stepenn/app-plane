/**
 * Created by apin on 2017/5/30.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './TicketInforDesc.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import Switch from '../../public/Switch/index.js'
import Toast from "../../../component/Toast/index.js"
import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Loading from '../../../component/Dialog/Loading/index.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.isClicked = this.Help.app_getParameter(this).isRead;
        this.state  = {
            upData:0,
        }
        this.img_submit = window.imgHost + '/images/submit_btn.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }

    upView() {
        this.setState({
            upData: this.state.upData + 1,
        })
    }
    animEnter() {
        this.loadNet();
    }
    loadNet() {
        var param = {}
        var successCallback = (code, message, json, option) => {
            this.data = json;
            this.upView();
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_common_getBuyNotice, successCallback, failCallback, param);
    }

    render() {
        var div =null;
        if (!this.data){
            div = (<div className={css.main}>
                <div className={css.alertCss}>数据加载中,请耐心等待...</div>
            </div>);
        }else {
            div = (<ScrollDivV className={css.main}>
                <div className={css.bg}>
                    <div dangerouslySetInnerHTML={{__html:this.data}}/>
                </div>
                <div className={css.row}>
                    <div className={css.img}>
                         <Switch defaultSelect = {this.isClicked} select={(select)=>{
                             this.isClicked = select;
                         }}/>
                    </div>
                    <div className={css.title}>同意协议内容</div>
                </div>

                <div className={css.submit} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_submit)
                }} onClick={()=>{
                    var isBool = this.isClicked?1:2;
                    this.Help.setIntent(isBool);
                    this.Help.back(this);
                    // if (this.isClicked){
                    //     this.Help.setIntent(this.isClicked);
                    //     this.Help.back(this);
                    // }else {
                    //     Toast.showToast("请点击同意协议");
                    // }
                }}>同意</div>
                <br/>
            </ScrollDivV>);
        }
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;