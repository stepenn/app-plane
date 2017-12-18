import React, { Component } from 'react';
import css from './IndexRight.less';
import HelpI from '../../help/Help.js';
import CookieHelp from '../../tool/CookieHelp.js';
import Toast from '../../component/Toast/index.js';
import Button from '../public/Button/index';

import AudioHelp from '../../tool/AudioHelp'

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.audio = new AudioHelp('IndexRight');
        this.call_Back = props.call_Back;
        this.initSelectData();
        this.state = {
            upData:0,
        }
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        });
    }
    initSelectData(){
        this.addressData = [
            {url:window.imgHost + ('/images/balloon.png'),x:'0.1rem',y:'0.2rem',z:'',a:'',txt:'起航港',title:'起航港',link:'/BeginCity',message:""},
            {url:window.imgHost + ('/images/balloon.png'),x:'',y:'1.5rem',z:'',a:'0.2rem',txt:'着陆湾',title:'着陆湾',link:'/BeginCity',message:"请先选择起航港"},
            {url:window.imgHost + ('/images/img_bag.png'),x:'0.5rem',y:'3rem',z:'',a:'',txt:'选择航程类型',title:'选择航程类型',link:'/Ticket',message:"请先选择着陆湾"},
            {url:window.imgHost + ('/images/img_friends.png'),x:'',y:'4.5rem',z:'',a:'0.1rem',txt:'同行人数',title:'同行人数',link:"/FriendSelect",message:"请先选择起航日"},
            {url:window.imgHost + ('/images/icon_userInfo.png'),x:'3rem',y:'',z:'2rem',a:'',txt:'航行日志',title:'航行日志',link:'/Siege',message:"请先调动亲友"}
        ];
        this.img_secondBG = window.imgHost + '/images/img_secondBG.jpg';
        this.img_sayHello = window.imgHost + ('/images/wenhao.png');
        this.img_logo2 = window.imgHost + ('/images/img_indexLogo.png');
    }
    callback(select) {
        //被选择
        if (select) {
            this.audio.play('StartCreate');
            //清空当前的选择
            this.clearData();
        }
    }
    clearData(){
        this.initSelectData();
        this.upView();
    }
    componentDidMount() {
        if (this.props.selectCall) {
            this.props.selectCall(this.callback.bind(this));
        }
    }
    componentWillUnmount() {
        this.audio.stop();
    }
    getPostValue(){
    var pa = {};

        //第一步:出发地
        var step1 = this.addressData[0].info;
        if(step1){
            pa.depart_city_code = step1.city_code;
        }
        //第二步:目的地
        var step2 = this.addressData[1].info;
        if(step2){
            pa.dest_city_code = step2.city_code;
        }

        //第三步 粮饷 出征策略
        var step3 = this.addressData[2].info;
        if(step3){
            pa.yyyymm = step3.yyyymm;//年月，如201711
            pa.daynight = step3.daynight;//几天几晚
            pa.time_policy = step3.time_policy;//时间策略： 0-确定时间 1-工作时间 2-周末 3-黄金周

            if(step3.flight){
                pa.flight = step3.flight;//选择的精确航班，
                pa.journey_id = step3.flight.trip.id;
            }else{
                pa.flight = {
                    trip:{
                        from_city_name:step1.city_name,
                        to_city_name:step2.city_name,
                        daynight:step3.daynight,
                    }

                };//选择的模糊航班，模拟数据
            }

        }
        //第四步:人数
        var step4 = this.addressData[3].info;
        if(step4){
            pa.adult_count = step4.adult_count;//成人数
            pa.child_count = step4.child_count;//小孩子
        }

        var step5 = this.addressData[4].info;

        if(step5){
            pa.images = step5.images;//图片 (URL 数组)
            pa.memo = step5.memo;//备注
            pa.title = step5.title;//标题
        }


        return pa;
    }
	 render(){
	 	return (
              <div className={css.main} style={{
                  backgroundImage: this.Help.getImgUrl(this.img_secondBG)
              }}>
                <div style={{fontSize:"20px"}} onClick={()=>{
                    this.call_Back(true);
                }}></div>
				<div className={css.switchCity}>
					<div onClick={()=>{}}>
						<img className={css.sayHello} src={this.img_sayHello} />
					</div>
					<img className={css.logo} src={this.img_logo2} />
				</div>
				<div className={css.warCity}>
                    <SoldierList data={this.addressData}
                                 clearDataCallBack={()=>{
                                     this.clearData();
                                 }}
                                 call_Back={this.call_Back}
                                 getPostValue={this.getPostValue.bind(this)}
                    />
				</div>
			</div>
        )
	 }
}
class SoldierList extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state = {
            step:0,
        }
    }

    upView(step){
        this.setState({
            step:step,
        });
    }
    render() {
        const {data,clearDataCallBack,call_Back} = this.props;
        var showStep = this.state.step;
        //初始第一步
        if(data&&!data[0].info){
            showStep = 0;
        }

        var size = data.length;
        let html = data && data.length ? data.map((item, i) => {
            //初始第一步
            if(!item.info&&i<showStep){
                showStep = i;
            }
            if(i>=showStep){
                delete item.info;
            }
                return <OneSoldier
                    show={showStep >= i}
                    key={i}
                    step={i}
                    curr={showStep == i}
                    data={item }
                    getPostValue={this.props.getPostValue}
                    notice={(step) => {
                        //更新列表
                        {/*if (step >= (showStep + 1)) {*/}
                            {/*this.upView(step);*/}
                        {/*}*/}
                        //清空已显示数据
                        this.upView(step);
                    }
                    }
                />
            }
        ) : null;
        var submit = showStep >= (size - 1);
        return (
            <div>
                {html}
                <div className={submit ? css.submitActivity : css.submit}
                    onClick={() => {
                        if (submit) {
                            this.Help.app_open(this, "/PrePay", {
                                title: "航程明细",
                                postValue: this.props.getPostValue(),
                                callBack:(state)=>{
                                    if(state){
                                        if(clearDataCallBack){
                                            clearDataCallBack();
                                        }
                                        if (call_Back){
                                            call_Back(true);
                                        }else {
                                            this.Help.app_open(this,"/MyTrip", {
                                                title: "我的行程",
                                            });

                                            {/*var userInfo = CookieHelp.getUserInfo();*/}
                                            {/*if (!userInfo){*/}
                                                {/*return;*/}
                                            {/*}*/}
                                            {/*if (userInfo.status==3){*/}
                                                {/*this.Help.app_open(this,"/MyTeam", {*/}
                                                    {/*title: "我的领队",*/}
                                                    {/*isBack:true,*/}
                                                {/*});*/}
                                            {/*}else {*/}
                                                {/*this.Help.app_open(this,"/MyTrip", {*/}
                                                    {/*title: "我的行程",*/}
                                                {/*});*/}
                                            {/*}*/}
                                        }
                                    }
                                }
                            })
                        } else {
                            Toast.showToast("请先填写信息");
                        }
                    }}>
                    <Button>确认起航</Button>
                </div>
            </div>)
    }   }
class OneSoldier extends Component{
    constructor(props){
        super(props);
        this.data = this.props.data;
        this.Help = new HelpI();
        this.state ={
            upData:0
        }
        this.img_input = window.imgHost + '/images/img_input.png';
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        });
    }

    render(){
        const {show,curr,data,step,notice} = this.props;
        var Address = data.txt;
        var obj = data.info;
        if((step==0||step==1)&&obj){
            Address =   obj.city_name;
        }else if(step==2&&obj) {
            var v = obj.yyyymm.toString();
            var daynight =obj.daynight.replace(",","天")+"晚";
            var yyyymm = v.substring(4,v.length);
            if (parseInt(yyyymm.substring(0,1))==0){
                yyyymm = yyyymm.substring(1,2);
            }
            yyyymm = yyyymm+"月";
              Address =  yyyymm + daynight;
            // Address=obj.flight?((obj.flight.trip?obj.flight.trip.adult_price:"全网")+"/最低价"):"价格待定";
        }else if(step==3&&obj){
            var add = "";
            if(obj.adult_count>0) {
                add += (obj.adult_count + "/成人")
            }
            if(obj.child_count>0){
                add +=(" "+obj.child_count+ "/儿童");
            }
            Address = add;
        }else if(step==4&&obj){
            Address=obj.title?obj.title:"已填写";
        }
        return(
            <div style={{position:'absolute',left:data.x,top:data.y,bottom:data.z,right:data.a}}
                 onClick={()=>{

                     if(!show){
                         // Toast.showToast(data.message);
                         return;
                     }

                     var po = this.props.getPostValue();
                     var pv = {};
                     if(step==0){
                         //无限制
                     }else  if(step==1){
                           //限制出发城市
                         pv.depart_city_code = po.depart_city_code;
                     }else if(step==2){
                         pv.depart_city_code = po.depart_city_code;
                         pv.dest_city_code = po.dest_city_code;
                         if(po.yyyymm){
                             //已选过
                             pv.select = true;
                         }else{
                             pv.select = false;
                         }
                     }else if(step==3){
                         //已经选数据的数据
                         //同行人数
                         pv.adult_count = po.adult_count;
                         pv.child_count = po.child_count;

                     }else if(step==4){
                         //已经选数据的数据
                         pv.images = po.images;
                         pv.title = po.title;
                         pv.memo = po.memo;

                     }
                         var exe = ()=>{

                         this.Help.app_open(this,data.link,{
                             title:data.title,
                             step:step,
                             postValue:pv,//参数需要
                             callBack:(obj)=>{
                                 {
                                     data.info = obj;
                                     this.upView();
                                     //通知下一步可用
                                     if(notice){notice(step+1);}
                                 }
                             }
                         })
                     }
                     var userInfo = CookieHelp.getUserInfo();

                     if(!userInfo){
                         //去登录
                         log(this);
                         this.Help.app_open(this,"/Login",{
                             title:"登录",
                             callBack:(obj)=>{
                                 {
                                     if(obj){
                                         //继续执行
                                         exe();
                                     }
                                 }
                             }
                         })
                     }else{
                         exe();
                     }

                 }}
            >
                <div className={show?css.soldier:css.soldierHidden}

                >
                    <img className={curr?css.soldierImgFirstSelect:css.soldierImgFirst} src={data.url} />
                    <div
                        className={show ? css.soldierImgA : css.soldierImg} style={{
                            backgroundImage: this.Help.getImgUrl(this.img_input)
                        }}
                    >
                        {Address}
                    </div>
                </div>
            </div>
        )
    }
}
OneSoldier.contextTypes = {
    router: React.PropTypes.object
}
SoldierList.contextTypes = {
    router: React.PropTypes.object
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;