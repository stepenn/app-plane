/**
 * Created by apin on 2017/5/28.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './AboutAiPinJi.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import Toast from "../../../component/Toast/index.js"
import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Loading from '../../../component/Dialog/Loading/index.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.state = {
            upData: 0,
        }
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
        HttpTool.post(APIGYW.api_common_getAboutAipin, successCallback, failCallback, param);
    }

    render() {
        var div =null;
        if (!this.data){
            div = (<div className={css.main}>
                <div className={css.alertCss}>数据加载中,请耐心等待...</div>
            </div>);
        }else {
            div = (<ScrollDivV className={css.main}>
                <div className={css.row}>关于爱拼机</div>
                <div className={css.bg}>
                    <div dangerouslySetInnerHTML={{__html:this.data}}/>
                </div>

            </ScrollDivV>);
        }
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;