import React, { Component } from 'react';
import HelpI from '../../../../help/Help.js';
import css from './Agreement.less';
import APISP from '../../../../http/APISP.js';
import  HttpTool from  '../../../../http/HttpTool.js';
import ScrollView from '../../../../component/ScrollDiv/ScrollDivCom.js';
class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state ={
            content:"加载中",
        }
    }

    componentDidMount() {
        this.loadNet();
    }
    loadNet(){
        var successCallback = (code, message, json, option) => {
            this.setState(
                {
                    content:json,
                }
            );
        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    content:message
                }
            );
        };
        HttpTool.post(APISP.api_common_getBuyAgreement, successCallback, failCallback);
    }
    render(){
        var div = (
            <ScrollView className={css.main}>
                <div   dangerouslySetInnerHTML={{__html:this.state.content }}/>
            </ScrollView>

        )
        return this.Help.app_render(this,div,{title:'爱拼机购票协议'});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;