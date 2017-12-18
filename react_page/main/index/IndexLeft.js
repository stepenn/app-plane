import React, {Component} from 'react';
import css from './IndexLeft.less';
import ApinSelectView from '../../component/Dialog/ApinSelect/Select.js';
import HelpI from '../../help/Help.js';
import CookieHelp from '../../tool/CookieHelp.js';
import LocationHelp from '../plus/LocationHelp.js';
import  HttpTool from  '../../http/HttpTool';
import Toast from '../../component/Toast/index.js';
import APISP from '../../http/APISP.js';
import Loading from '../../component/Dialog/Loading/index';
class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.userInfo = CookieHelp.getUserInfo();
        this.message = "行程加载中";
        this.lock = true;
        this.p = 1;
        this.pCount = 0;
        this.autoTime = 3;
        this.state = {

            upData:0,
        }
        this.img_mainBG = window.imgHost + '/images/img_mainBG.jpg';
        this.img_logo = window.imgHost + '/images/img_indexLogo.png';
        this.img_changer = window.imgHost + '/images/img_changer.png';
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        });
    }
    componentDidMount() {
        this.loadLocation();
        // this.city = "杭州";
        // this.loadData(this.city)

    }
    loadBubbleData() {
        this.lock = true;
        // this.bubbleData = null;
        if(this.city){
            this.message = "正在加载 "+this.city+" 可登机行程";
            this.upView();
        }else{
            this.message = "很抱歉,定位失败,请手动选择登机城市(左上角)!^_^";
            this.upView();
            return;
        }

        var timeValue = 1500;

        var successCallback = (code, message, json, option) => {

            setTimeout(()=>{
                if (json && json.length>0) {
                    this.bubbleData = json;
                } else{
                    this.bubbleData = null;
                }
                this.message = message;
                this.lock = false;
                this.pCount = this.pCount+1;
                this.upView();
            },timeValue)


        };
        var failCallback = (code, message,json) => {
            setTimeout(()=>{
                this.message = message;
                this.bubbleData = null;
                this.lock = false;
                this.upView();
                //非第一首页
                if(code==-2&&this.p!=1){
                    //数据结束
                    this.autoGoIndexData();
                }
            },timeValue)


        };
        setTimeout(()=>{
            //动画之后,显示方案
            this.bubbleData = null;
            this.upView();
        },timeValue)
        HttpTool.post(APISP.api_route_getRouteListByCityName, successCallback, failCallback, {
            city_name: this.city,
            p: this.p,
            pc: 4
        });

    }
    autoGoIndexData(){
        this.autoTime = this.autoTime-1;
        setTimeout(()=>{
            this.messageDesc = this.autoTime+"秒后,为你回到首页";
            this.upView();
            if(this.autoTime<1){
                this.p = 1;
                this.loadBubbleData();
            }else{
                this.autoGoIndexData();
            }


        },1000)
    }

    loadLocation() {
        this.message = "正在为你定位登机城市";
        this.upView();
        LocationHelp.openLocation((p) => {
            //得到当前城市
            var apin_city = CookieHelp.getCookieInfo("apin_city")
            // console.log(apin_city);
            if (p && p.address) {
                //无更换城市
                this.city = p.address.city;
                if (apin_city == this.city) {
                    this.loadData(this.city)
                } else {
                    this.openSwitch(this.city)
                }

            } else {
                this.city = apin_city;
                this.loadData(this.city)
            }
            //请求附近城市
        }, (e) => {
            this.loadData();
        })
    }
    animEnter(){

    }

    /**
     * 加载首页数据
     * @param location 存在:定位成功 不存在:定位失败
     */
    loadData(cityName) {
        //地理位置更新,更新数据显示
        this.p = 1;
        this.loadBubbleData();
        //更新城市显示
        if (this.TitleItemSetTitle) {
            // alert("选择了:"+cityName);
            this.TitleItemSetTitle(cityName?cityName:"选择登机城市");
        }
    }
    openSwitch(city)
    {

        if (this.SelectCity) {
            this.SelectCity.setListen((yes)=>{
                    //关闭之后
                    if (yes) {
                        //关闭页面,并打开浏览器
                        this.switchCity(city);
                    } else {
                        this.loadData(city)
                    }
            })
            this.SelectCity.setCity(city)
            this.SelectCity.show(true)
        }
    }
    randomImg(a, b) {
        return Math.floor(Math.random() * (b - a) + 1);
    }

    ChangeCity() {
        this.count = true;
        this.setState({
            active: !this.state.active,
            p:this.state.p + 1
        }, () => {
            Loading.show(true);
            setTimeout(()=>{
                Loading.show(false,()=>{
                    this.loadBubbleData();
                });
            },1000);
        })
    }
    switchCity(city) {
        //Toast.showToast("切换成功")
        CookieHelp.saveCookieInfo("apin_city", city);
        this.city = city;
        this.loadData(city);
    }
    render() {
       return(
        <div className={css.container}>
               <div className={css.main} style={{
                   backgroundImage: this.Help.getImgUrl(this.img_mainBG)
               }}>
            <div>
                <div className={css.switchCity}>
                    <div className={css.selectCity} onClick={() => {
                        this.Help.app_open(this, '/SelectCity', {
                            title: "选择城市", callBack: (city) => {
                                if (city && city.city_name && this.city == city.city_name) {
                                    return;
                                }
                                this.switchCity(city.city_name)
                            }
                        })
                    }}>
                        <img className={css.switch} src={this.img_changer}/>
                        <TitleItem
                            setTitle={(fun) => {
                                this.TitleItemSetTitle = fun;
                            }}
                            title={this.city ? this.city : "切换城市"}
                        />
                    </div>
                    <img className={css.logo} src={this.img_logo} />
                    <div className={this.lock?css.changeCityA:css.changeCity} onClick={
                        ()=>{

                            //事件完成之前,点击无效
                            if(this.lock){
                                return;
                            }
                            this.p = this.p+1;

                            this.loadBubbleData();
                        }
                    }
                    >换一组
                    </div>
                </div>
                <div>
                    {this.getBubbles(this.bubbleData)}
                </div>
            </div>
            </div>
            <SelectCity
                action={(obj)=>{
                    this.SelectCity = obj;
                }}
            />
        </div>
        )
    }


    getBubbles(bubbleData) {
        if(!bubbleData){
            return <div className={css.css_layout_none}>
                <div>{this.message}</div>
                <div>{this.autoTime>0?this.messageDesc:""}</div>
            </div>
        }
        return <PPLayout data={bubbleData} p={this.pCount} lock={this.lock} Help={this.Help} />
    }
}
class SelectCity extends Component{
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
                    setCity:this.setCity.bind(this),
                }
            );
        }
        if(this.props.select){

        }
    }
    setCity(city){
        if(city){
            this.city = city;
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
    render(){
        var style = {}
        if(!this.state.show){
            style = {display:"none"};
        }
        return(
            <div style={style}>
                <ApinSelectView
                    option={ {
                        content: "定位到你在" + this.city + " 是否切换？",
                        confirm: '稍后再说',
                        cancel: '立即切换'
                    }}
                    callBack={(yes) => {
                        if(this.props.select){
                            this.props.select(yes);
                        }
                        if(this.callBack){
                            this.callBack(yes);
                        }
                    }}
                    onCancel={()=>{
                        if(this.props.select){
                            this.props.select(false);
                        }
                        if(this.callBack){
                            this.callBack(false);
                        }
                        this.show(false);
                    }}

                />
            </div>
        );
    }
}
class PPLayout extends Component{
    constructor(props){
        super(props);
        this.state = {
            upData:0,
        }
    }
    componentDidMount() {

        this.loadData();
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        });
    }
    loadData(){
        //计算机当前的在大小,平分,每个显示区域
        log(this.refs)
        this.height = this.refs.dom.clientHeight;
        this.upView();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.p!=this.props.p){
            //不是同一页,更新显示
            this.loadData();
        }
    }
    render(){
        var viewS = [];
        if(this.height){
        var {data,Help,p,lock} = this.props;
        var size = data.length;
        var maxSize = 4;
        if(size>maxSize){
            size = maxSize;
        }
        var itemHeight = this.height/maxSize-14;
        var baseH = 45;



        for(let i =0;i<size;i++){
            let obj = data[i];
            var cssAnim = null;
            if(lock){
                cssAnim  = i%2==0?css.ppItemLeftOut:css.ppItemRightOut;
            }else{
                cssAnim  = i%2!=0?css.ppItemRight:css.ppItemLeft;
            }
            viewS.push(
                <PPItem key={i+"_"+p}
                        data={obj}
                        className={cssAnim}
                        style={{
                            height:itemHeight,
                            left:i%2!=0?"auto":"0px",
                            right:i%2!=0?"0px":"auto",
                            top:baseH+itemHeight*i+"px",
                        }}
                        right={i%2!=0}
                        onClick={() => {
                            Help.app_open(this, '/TripDetails',
                                {
                                    title: "航程详情",
                                    route_id: obj.id,
                                    callBack:(state)=>{
                                        if(state){
                                            obj.member_count = parseInt(obj.member_count)+state;
                                            this.upView();
                                            Help.app_open(this,"/MyTrip", {
                                                title: "我的行程",
                                            });
                                        }
                                    }
                                }
                            )
                        }}
                >
                </PPItem>
            )
        }
        }
        return <div
            ref={"dom"}
            className={css.ppBg}
        >{
            viewS
        }</div>;
    }
}
class PPItem extends Component{
    render(){
        var {data,right,type} = this.props;

        //30 黄色 30-100 紫色 100+ 红
        var lv1 = 30,lv2=100;

        var type = 1;
        if(data.member_count<lv1){
            type = 3;
        }else if(data.member_count<lv2){
            type = 2;
        }else{
            type = 1;
        }
        return (
            <div {...this.props}>
                <div className={css.ppItemIcon}
                     style={{
                         backgroundImage:data.avatar?"url('"+data.avatar+"')":null,
                     }}
                />
                <div className={css.ppItemIconFrame}
                     style={{
                         backgroundImage:"url('"+window.imgHost +"/images/index_i_"+(type)+".png')"
                     }}
                />
                <div className={css.ppItemName}>{data.nick_name}</div>
                <div className={css.ppItemFloat}
                style={{
                    left:right?"auto":"0px",
                    right:right?"0px":"auto",
                    backgroundImage:"url('"+window.imgHost +"/images/index_"+(right?"r":"l")+"b_"+(type)+".png')"
                }}
                >
                    <div>{data.from_city_name+"-"+data.to_city_name+" "+data.depart_date+"出发 往返￥"+
                    data.adult_price+"/人"}</div>
                    <div>{" 已报名"+(data.member_count?data.member_count:0)+"人 截止"+data.safe_date}</div>
                </div>
            </div>
        )
    }
}
class TitleItem extends Component {
    constructor(props) {
        super(props);
        this.state = {title: this.props.title};
        if (this.props.setTitle) {
            this.props.setTitle(this.setTitle.bind(this));
        }
    }

    setTitle(title) {
        this.setState({
            title: title,
        });
    }

    render() {
        return (
            <span>
                {this.state.title}
            </span>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
PPLayout.contextTypes = {
    router: React.PropTypes.object
}

module.exports = page;
