import React, { Component } from 'react';
import HelpI from '../../../help/Help.js';
import ApinSelect from '../../../component/Dialog/ApinSelect/index.js';
import Toast from '../../../component/Toast/index.js';
import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import  HttpTool from  '../../../http/HttpTool.js';
import APISP from '../../../http/APISP.js';
import Switch from '../../public/Switch/index.js';
import ChooseData from '../../public/ChooseData/index';
import Button from '../../public/Button/index';
import css from './ticket.less';

import AudioHelp from '../../../tool/AudioHelp'

import Swiper from 'swiper'

class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.audio = new AudioHelp('ticket');
        this.count = 0;
        this.state = {
            show:false,
            message:"小拼正在飞速加载中...",
            monthKey:1,
            dayKey:1,
            upData:0,
        }
        this.img_battleTitle = window.imgHost + '/images/battle_title.png';
        this.img_inpuPW = window.imgHost + '/images/input_PW.png';
        this.img_downArrow = window.imgHost + '/images/img_downArrow.png';
        this.img_board = window.imgHost + '/images/bg_board.png';
    }
    
    componentDidMount() {
        this.audio.play('DateSelection');
    }

    upViewMonthKey(){
        this.setState({
            monthKey:this.state.monthKey+1,
            dayKey:this.state.dayKey+1,
        });
    }
    upViewDayKey(){
        this.setState({
            dayKey:this.state.dayKey+1,
        });
    }
    upView(){
        log("刷新页面")
        this.setState({
            upData:this.state.upData+1,
        });

    }



    loadDaysData(){


        if(!this.Help.app_getParameter(this).postValue){
            this.setState(
                {
                    show:true,
                    message:"缺少postValue参数"
                }
            );
            return;
        }

        var successCallback = (code, message, json, option) => {

            this.allData = [];
            for(let i in json){
                var v = json[i].yyyymm.toString();
                this.allData.push({
                    time_policy:json[i].time_policy,
                    daynight:json[i].daynight.replace(",","天")+"晚",
                    yyyymm:v.substring(0,4)+"年"+v.substring(4,v.length)+"月",
                    adult_price: json[i].adult_price,
                    child_price: json[i].child_price,
                })
            }
            this.setState({show:true,message:message});

        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    show:true,
                    message:message
                }
            );
        };
        // var a = {
        //     epart_city_code: "HGH", dest_city_code: "DLC"
        // }
        // HttpTool.post(APISP.api_route_getYYMMDayNight, successCallback, failCallback, a);
        HttpTool.post(APISP.api_route_getYYMMDayNight, successCallback, failCallback, this.Help.app_getParameter(this).postValue);
    }
    animEnter(){

        this.loadDaysData();

    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    render(){

        var main =   <div className={css.css_layout_none}>{this.state.message}</div>;
        if(this.state.show){
            this.getData_Type();
            this.getData_Month();
            this.getData_Day();

            log(this.data_type)
            log(this.data_month)
            log(this.data_day)
            log(this.select_type)
            log(this.select_month)
            log(this.select_day)
            log("this.state.dayKey:"+this.state.dayKey)


            main = (
                <div>
                    <br/>
                    <CoverFlow
                        data={this.data_type}
                        select={(state)=>{
                            if(this.select_type==state){
                               return;
                            }
                            this.select_type = state;
                            log("this.select_type:"+this.select_type);
                            this.select_day = null;
                            this.upViewMonthKey();

                        }}
                    />
                    <div className={css.chooseMonth} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_board)
                    }}>选择航行月份和天数</div>
                    <div className={css.arrowMonth} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_downArrow)
                    }}/>
                    <div className={css.month} style={{
                        backgroundImage:this.Help.getImgUrl(this.img_board)
                    }}>
                        <ChooseData
                            key={"month_"+this.state.monthKey}
                            data={this.data_month}
                            select={(state)=>{
                                if(this.select_month==state){
                                    return;
                                }
                                this.select_month = state;
                                log("this.select_month:"+this.select_month);
                                this.select_day = null;
                                this.upViewDayKey();
                            }}
                        />
                        <ChooseData
                            key={"day_"+this.state.dayKey}
                            data={this.data_day}
                            select={(state)=>{
                                log(state)
                                this.select_day = state;
                                //只渲染,不更新
                                this.upView();
                            }}
                        />

                        <div className={css.money}>{this.getMoneyForSelect()}</div>


                    </div>

                    <br/>
                    <div className={css.xieyiLayout}>
                        <div className={css.xieyi} >
                            <Switch
                                defaultSelect={this.Help.app_getParameter(this).postValue.select}
                                select={(state)=>{
                                    this.select_switch = state;
                                }}
                            />
                        </div>
                        <div className={css.xieyi} onClick={()=>{
                            this.Help.app_open(this,'/Agreement',{title:'爱拼机购票协议'})
                        }}>
                            <div className={css.xieyi}>
                                爱拼机购票协议
                            </div>

                        </div>
                    </div>
                    <br/>
                </div>
            )
        }
        var div = (
        <div className={css.main}>
            <ScrollView className={css.mainTop}>
                {main}
            </ScrollView>
            <div className={css.submit}>
                <Button  onClick={()=>{
                    var postValue = this.Help.app_getParameter(this).postValue;
                    if(!postValue){
                        postValue = {};
                    }
                    postValue.time_policy = this.select_type;
                    postValue.yyyymm = this.select_month.replace("年","").replace("月","");
                    postValue.daynight = this.select_day.replace("天",",").replace("晚","");
                    log(postValue);
                    if(!this.select_day){
                        Toast.showToast("请选择出行规则(如出现此问题 请退出重进)");
                        return;
                    }
                    if(!this.select_switch){
                        Toast.showToast("请阅读购票协议");
                        return;
                    }

                    ApinSelect.open((yes)=>{
                        this.selectYes = yes;
                    },{
                        content:"您已选择"+this.select_month+""+this.select_day+"出行计划，具体航班我们为您挑选。",
                        confirm:'更多航班',
                        cancel:'提交策略'
                    },()=>{
                        //关闭之后
                        if (typeof(this.selectYes) == "undefined") {
                            return;
                        }
                        if(this.selectYes){
                            postValue.flight = null;
                            this.Help.setIntent(postValue);
                            this.audio.stop();
                            this.Help.back(this);
                        }else{
                            this.Help.app_open(this,'/MoreFlights',{
                                title:'航班列表',
                                postValue:postValue,
                                callBack:(obj)=>{
                                    if(obj!="none"){
                                        //选择了,带价格
                                        postValue.flight = obj;
                                    }else{
                                        //没有选择

                                    }
                                    this.Help.setIntent(postValue);
                                    this.audio.stop();
                                    this.Help.back(this);
                                }
                            })
                        }
                    });
                }}>下一步</Button>
            </div>
        </div>


        )
        return this.Help.app_render(this,div);
    }

    test(){

        var allData = [];
        for(let i =0;i<20;i++){
            allData.push({
                daynight:"5,"+i,
                time_policy:i%3,
                yyyymm:"20170"+i,
            })
        }
        log(allData);
        var a = this.getValues(allData,"yyyymm",1,null,null);
        log(a);
    }

    getData_Type(){
        this.data_type = this.getValues(this.allData,"time_policy",null,null,null);
        if(!this.select_type){
            this.select_type = this.data_type&&this.data_type.length>0?this.data_type[0]:null;
        }

        // this.data_type=this.data_type.concat(this.data_type);
        return this.data_type;
    }
    getData_Month(){
        if(!this.select_type){
            return null;
        }

        this.data_month = this.getValues(this.allData,"yyyymm",this.select_type,null,null);
        if(!this.select_month){
            this.select_month = this.data_month&&this.data_month.length>0?this.data_month[0]:null;
        }

        return  this.data_month;
    }
    getData_Day(){
        if(!this.select_month){
            return null;
        }
        this.data_day = this.getValues(this.allData,"daynight",this.select_type,this.select_month,null);
        if(!this.select_day){
            this.select_day = this.data_day&&this.data_day.length>0?this.data_day[0]:null;
        }


        return this.data_day;
    }
    getMoneyForSelect(){
        log("当前值为")
        var obj = this.getPrices(this.allData,this.select_type,this.select_month,this.select_day);
        log("objobjobj")
        log(obj)
        if(obj&&obj.adult_price&&obj.child_price){
            return "成人:￥"+obj.adult_price+ "  儿童:￥"+obj.child_price;
        }else{
            return "暂无价格";
        }
        // return this.select_type+"_"+this.select_month+"_"+this.select_day;
    }
    getPrices(allData, time_policy, yyyymm, daynight) {
        log(time_policy)
        log(yyyymm)
        log(daynight)
        var result = {};
        for (let data of allData) {
            log(data)
            if ( data.time_policy == time_policy && data.yyyymm == yyyymm && data.daynight == daynight) {
                result.adult_price = data.adult_price;
                result.child_price = data.child_price;
                break;
            }
        }
        return result;
    }

    unique1(array){
    var n = [];
    for(var i = 0; i < array.length; i++){
        if (n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
}
    getValues(allData, field_name, time_policy, yyyymm, daynight) {
        var result = [];
        for (var data of allData) {
            if (time_policy && data.time_policy != time_policy) continue;
            if (yyyymm && data.yyyymm != yyyymm) continue;
            if (daynight && data.daynight != daynight) continue;
            result.push(data[field_name]);
        }
        return this.unique1(result);
    }
}

class CoverFlow extends Component{
    constructor(props){
        super(props)
        this.state = {
            select:[],
        }
        log("=========")
        log(this.props.data);
        log("=========")
        this.img_strange = window.imgHost + '/images/strange.png';
        this.img_strangeF = window.imgHost + '/images/strange-f.png';
        this.img_t = window.imgHost + '/images/t.png';
        this.img_strangeS = window.imgHost + '/images/strange-s.png';
    }
    initSwiper(){

        // new Swiper(this.container, {
        //     wrapperClass: css['content'],
        //     slideClass: css['content_page'],
        // })

        log(window.Swiper);
        this.Swiper = new Swiper(this.refs.secs, {
            effect : 'coverflow',
            slidesPerView: 3,
            wrapperClass: css["content"],
            slideClass: css["content_page"],
            centeredSlides: true,
            coverflow: {
                rotate: -20,
                stretch: -12,
                depth: 60,
                modifier: 2,
            },
            observer: true,
            observeParents: true,
            onInit: (swiper)=>{
                this.setSelect(swiper.activeIndex);
            },
            onTransitionEnd: (swiper)=>{
                this.setSelect(swiper.activeIndex);
            },
            onSlideChangeEnd: (swiper)=> {
                this.setSelect(swiper.activeIndex);
            }
        });
    }
    setSelect(i){
        this.setState({
            index:i,
        });
        if(this.props.select){
            this.props.select(this.props.data[i]);
        }
    }
    componentDidMount(){
        this.initSwiper();
    }
    getType(i,title,desc,icon){
        return(
            <div key={i}
                 className={css["content_page"]}
                 onClick={()=>{
                     this.Swiper.slideTo(i, 1000, false);//切换到第一个slide，速度为1秒
                     this.setSelect(i);
                 }}
            >
                <div className={css.strange} style={{
                    backgroundImage: `url(${this.img_strange})`
                }}>
                    <OnSunday title={title}  icon={icon} time={desc} />
                </div>
            </div>
        )
            ;
    }


    render(){
        // 0-确定时间 1-工作时间 2-周末 3-黄金周
        // 0-确定时间 1-工作时间 2-周末 3-黄金周
        //周末打怪 周六、周日
        let size = this.props.data?this.props.data.length:0;
        var viewS = [];
        for(let i =0;i<size;i++){
            let obj =  this.props.data[i];
            var title ,desc ,icon;
            if(obj==1){
                title = "翘班出击";
                desc = "周一至周五";
                icon = this.img_strangeF;
            }else  if(obj==2){
                title = "周末打怪";
                desc = "周六、周日";
                icon = this.img_t;
            } else if(obj==3){
                title = "黄金护甲";
                desc = "假日黄金周";
                icon = this.img_strangeS;
            }else{
                title = "确定时间";
                desc = "时间待定";
                icon = this.img_strangeF;
            }
            viewS.push(this.getType(i,title,desc,icon))
            // viewS.push(<div key={i} className={css['content_page']}>
            //     {JSON.stringify(obj)}
            // </div>)
        }


        return(
            <div className={css.slider}>
                <div className={css.sliderTouch}  ref="secs" >
                    <div className={css["content"]} >
                        {viewS}
                    </div>
                </div>
            </div>
        )
    }
}

class OnSunday extends Component{
    constructor(props){
        super(props);
        this.state ={
        }
        this.img_input = window.imgHost + '/images/img_input.png';
    }
    render(){
        const {title,icon,time}=this.props;
        return(
            <div className={css.box}>
                <div className={css.title} style={{
                    backgroundImage: `url(${this.img_input})`
                }}>{title}</div>
                <img className={css.strangeIcon} src={icon} />
                <div>{time}</div>
                <div>全网最低价</div>
                <div>任意时段</div>
            </div>
        )
    }
}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
