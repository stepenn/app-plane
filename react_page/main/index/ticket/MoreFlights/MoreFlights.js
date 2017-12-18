import React, { Component } from 'react';
import HelpI from '../../../../help/Help.js';
import ApinSelect from '../../../../component/Dialog/ApinSelect/index.js';
import  HttpTool from  '../../../../http/HttpTool.js';
import APISP from '../../../../http/APISP.js';
import Toast from '../../../../component/Toast/index.js';
import ScrollView from '../../../../component/ScrollDiv/ScrollDivCom.js';
import Button from '../../../public/Button/index.js';
import css from './MoreFlights.less';

import ItemTripDetail from '../../../cell/ItemTripDetail.js';
class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.Help.setPageAnimOption({type:"top"});
        this.state ={
            FlightListData:[],
            success:false,
            message:"加载中"
        }
        this.img_battleTitle = window.imgHost + '/images/battle_title.png';
    }
    getFlightList(){
        var successCallback = (code, message, json, option) => {
            this.setState(
                {
                    FlightListData:json,
                    success:true,
                    message:message,
                }
            );
        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    FlightListData:[],
                    success:true,
                    message:message,
                }
            );
        };
        var param = this.Help.app_getParameter(this).postValue;
        HttpTool.post(APISP.api_route_getFlightLines, successCallback, failCallback,param);
    }
    componentDidMount(){
        this.getFlightList();
    }
    componentWillUnmount(){
        this.Help.setIntent(this.selectObj?this.selectObj:"none");
        this.Help.close(this);
    }
    render(){

        var main = <div  className={css.css_layout_none}>{this.state.message}</div>;
        if(this.state.success){
            var size = this.state.FlightListData.length;
            if(size>0){
                main = [];
                for(var i=0;i<size;i++){
                    let obj = this.state.FlightListData[i];
                    main.push(
                        <div
                            onClick={()=>{
                                //点击返回
                                this.selectObj = obj;
                                this.Help.back(this);
                            }}
                            key={i}
                            className={css.test}

                        >
                            <ItemTripDetail data={obj}
                                            showMoney={true}
                                            isPayShowClicked={true}
                            /></div>
                    )
                }
            }
        }

        var div = (
            <div  className={css.main}>
                <div className={css.chooseBattle} style={{
                    backgroundImage:this.Help.getImgUrl(this.img_battleTitle)
                }}>请选择具体航线</div>
                <ScrollView className={css.sc}>
                    {main}
                </ScrollView>
                <div className={css.bottom}>
                    <Button
                    onClick={()=>{
                        this.Help.back(this);
                    }}
                    >先不选</Button>
                </div>

            </div>


        )
        return this.Help.app_render(this,div,{full:true});
    }
}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
