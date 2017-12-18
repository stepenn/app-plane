import React, { Component } from 'react';
import css from './TripDetails.less';
import HelpI from '../../../help/Help.js';
import  ScrollView from  '../../../component/ScrollDiv/ScrollDivCom.js';
import  HttpTool from  '../../../http/HttpTool.js';
import  CookieHelp from  '../../../tool/CookieHelp.js';
import  ImageLoad from '../../../component/ImageLoad/index';
import Toast from '../../../component/Toast/index.js';
import TimeHelp from '../../../tool/TimeHelp.js';
import Share from '../../../component/Dialog/Share/index.js';
import APISP from '../../../http/APISP.js';
import Swiper from 'swiper'
import AudioHelp from '../../../tool/AudioHelp';
class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();

        this.audio = new AudioHelp('TripDetails');
        this.userInfo = CookieHelp.getUserInfo() ? CookieHelp.getUserInfo() : {};
        this.count = 0;
        this.state ={
            groupData:{},
            message:"loading...",
            success:false,
        }
        this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
        this.img_board = window.imgHost + '/images/bg_board.png';
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
        this.img_moreDetail = window.imgHost + '/images/img_moreDetail.png';
        this.img_headRing = window.imgHost + '/images/bg_head_ring.png';
    }
    animEnter(){
        this.getMemberData();
    }
    getMemberData(){
        var successCallback = (code, message, json, option) => {
            // alert((json.leader.id==this.userInfo.id)+': '+json.route.member_count);
            if (json.leader.id == this.userInfo.id) {
                if (json.route.member_count >= 15 && json.route.member_count < 30) {
                    this.audio.play('Half');
                }
                if (json.route.member_count == 30) {
                    this.audio.play('Complete');
                }
            }
            this.setState(
                {
                    message:message,
                    groupData:json,
                    success:true
                }
            );
        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    message:message,
                    groupData:{},
                    success:false
                }
            );
        };
        HttpTool.post(APISP.api_route_getRouteDetail, successCallback, failCallback, {
            route_id:this.Help.app_getParameter(this).route_id
        });
    }
    componentWillUnmount(){
        this.Help.close(this);
    }

    render(){
        var main = <div className={css.css_layout_none}>{this.state.message}</div>
        var actionView = null;
        const data = this.state.groupData;
        if(data&&data.route){
            main = <div>
                <div className={css.tripTitle}>
                    {data.route.from_city_name + '-' + data.route.to_city_name}
                </div>
                <HeadView data={this.state.groupData} />
                <RecruitList data={this.state.groupData} />
                <div className={`${css.FlightFriends} ${css.clearfix}`}>
                    <div className={`${css.leader} ${css.clearfix}`}>
                        <div className={css.leaderPerson}>领队:</div>

                        <div className={css.leaderFace} onClick={()=>{
                            this.Help.app_open(this, '/PersonDetail', {
                                title: '个人中心',
                                friendId: data.leader.id,
                                friendFrom:3
                            })
                        }}>
                            <ImageLoad type={1} bg={true} bgStyle={{borderRadius: "50%",}}
                                       src={data.leader.avatar} error={this.img_defaultAvatar}/>

                            <div className={css.bg} style={{
                                backgroundImage:this.Help.getImgUrl(this.img_headRing)
                            }}></div>

                        </div>
                        <div className={css.leaderName}>{data.leader.nick_name}</div>
                    </div>
                    <div className={css.signUp}>
                        {data.route.member_count?<div>
                            <span style={{fontSize:"0.40rem"}}>{"已报名 "}</span>
                            <span style={{fontWeight:'bold',fontSize:'0.5rem'}}>{data.route.member_count}</span>
                            <span style={{fontSize:"0.40rem"}}>{" 人"}</span>
                        </div>:null}
                    </div>
                </div>
                <div className={css.teamBox}>
                    <div className={css.faceImg}>
                        {data.members?data.members.map((item,i)=>{
                            return <div key={i} onClick={()=>{
                                this.Help.app_open(this, '/PersonDetail', {
                                    title: '个人中心',
                                    friendId: item.user_id,
                                    friendFrom:3
                                })
                            }}>
                                <div className={css.teamImg}>
                                    <ImageLoad type={1} bg={true} bgStyle={{
                                        borderRadius: "50%",
                                    }} src={item.avatar}
                                               error={this.img_defaultAvatar}/>
                                    <div className={css.bg} style={{
                                        backgroundImage:this.Help.getImgUrl(this.img_headRing)
                                    }}></div>
                                </div>
                              </div>
                            }):<div>暂无小伙伴加入</div>}
                    </div>
                    {  data.members&&data.members.length>5?
                        <div className={css.MoreFriends} style={{
                            backgroundImage: this.Help.getImgUrl(this.img_moreDetail)
                        }} onClick={() => {
                            this.Help.app_open(this, '/MoreMember', {
                                title: '同行人员',
                                id: this.Help.app_getParameter(this).route_id
                            })
                        }}></div>:null
                    }
                </div>

                <div className={css.refTripWill}>
                    <div className={css.row}>
                        <div className={css.left}>
                            <div className={css.sign}></div>
                        </div>
                        <div className={css.right}>{data.route.title?data.route.title:"规则介绍"}</div>
                    </div>
                    <div className={css.line}>
                        {data.route.memo?data.route.memo:'暂无计划'}
                    </div>
                </div>



                <br/>
                <br/>
                <br/>
                <br/>
            </div>


//             主标题：如果你不出去走走，你就会以为这就是世界。
// 副标题：只要半个平米的价格，我们一起拼机去xxx（地）吧。

            // var c_time = data.route.daynight?(data.route.daynight.replace(",","天")+'晚'):"";
            // var f_t = data.route.from_city_name + "-"+data.route.to_city_name;
            // var content = "来一场"+f_t +"  "+c_time+"说走就走的旅行";
            // var c_title = data.leader?("行程 "+f_t+"  领队:"+data.leader.nick_name):"来自驴友的行程";


            var c_title = "如果你不出去走走，你就会以为这就是世界"
            var content = "只要一部手机的价格，我们一起拼机去 "+data.route.to_city_name+"吧。"

            actionView = <span className={css['invite-logo']}
                               style={{
                                   backgroundImage: this.Help.getImgUrl(this.img_rightArrow)
                               }}
                               onClick={()=>{
                                   Share.open((state,info)=>{
                                       if(state){
                                           Toast.showToast("分享成功");
                                           //组件已关闭
                                       }else{
                                           //关闭页面
                                       }
                                      // alert(state)
                                   },{
                                       title:c_title,
                                       content:content ,
                                       href: data.shareUrl,
                                   },()=>{
                                      // alert("页面关闭分享");
                                   })

                               }
                               }
            />;
        }




        var div = (
            <div>
                <ScrollView className={css.main}>
                    {main}
                </ScrollView>
                <div className={css.joinTrip} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_board)
                }} onClick={()=>{
                    if(data.route){
                        if(data.route.is_joined==0){
                            {/*Toast.showToast("您已加入过该行程");*/}
                            this.openJoin();
                        }
                    }
                }}>{(data.route?(data.route.is_joined>0?'您已加入':'共同起航'):null)}
                </div>
            </div>
        )
        return this.Help.app_render(this,div,{actionView:actionView});
    }


    openJoin() {
        var flight = {
            trip:this.state.groupData.route,
        }
        var exe = () => {
            this.Help.app_open(this,'/FriendSelect',{
                title:'调动亲友',
                callBack:(postValue)=>{
                    this.num = parseInt(postValue.adult_count)+parseInt(postValue.child_count);
                    postValue.flight =flight;
                    postValue.route_id =flight.trip.id;
                    this.Help.app_open(this,'/PrePay',{
                        title:'航程明细',
                        postValue:postValue,
                        callBack:(state)=>{
                            if(state){
                                this.Help.setIntent(this.num);
                                this.Help.back(this);
                            }
                        }
                    })
                }
            })
        }
        var userInfo = CookieHelp.getUserInfo();
        if (!userInfo) {
            this.Help.app_open(this, "/Login", {
                title: "登录", callBack: (state) => {
                    if (state) {
                        exe();
                    }
                }
            })
        } else {
            exe();
        }
    }
}
class RecruitList extends Component{
    constructor(props) {
        super(props);
        this.img_start = window.imgHost + '/images/start.png';
        this.img_end = window.imgHost + '/images/end.png';
        this.img_tripDoubleArrow = window.imgHost + '/images/img_tripDoubleArrow.png';
    }
    render() {
        var {data}=this.props;
        var item = '';
        if(data.journeys){
            item = data.journeys;
        }

        var titleDiv=null;
        if (data.route.title){
            titleDiv=
                <div className={css.row}>
                    <div className={css.left}>
                        <div className={css.sign}></div>
                    </div>
                    <div className={css.right}>{data.route.title}</div>
                </div>
        }else {
            titleDiv=<div className={css.row}>
                <div className={css.left}>
                    <div className={css.sign}></div>
                </div>
                <div className={css.right}>
                    <span style={{fontSize:"0.4rem"}}>{"您当前加入的是"}</span>
                    <span style={{fontSize:"0.45rem"}}>{" "+data.route.daynight.replace(",","天")+'晚'}</span>
                    <span style={{fontSize:"0.45rem"}}>{","+data.route.from_city_name+"-"+data.route.to_city_name}</span>
                    <span style={{fontSize:"0.4rem"}}>{" "+"的航班"}</span>
                </div>
            </div>
        }
        var priceDiv=null;
        if (data.route.adult_price){
            priceDiv=<div className={css.line}>
                <span style={{fontSize:"0.4rem"}}>{" "+"成人: "}</span>
                <span style={{fontSize:"0.4rem"}}>{"￥"+data.route.adult_price}</span>
                <span style={{fontSize:"0.4rem"}}>{" "+"儿童: "}</span>
                <span style={{fontSize:"0.4rem"}}>{"￥"+data.route.child_price}</span>
            </div>
        }else {
            priceDiv=null;
        }

        var itemView = (
            <div {...this.props} className={css.tripWill}>
                {titleDiv}
                {priceDiv}
                {item? <div className={css.flightPlan}>
                    <div className={css.flightTime}>
                        <div className={css.row}>
                            <div className={css.left}>
                                <div className={css.sign}></div>
                            </div>
                            <div className={css.right}>航班计划</div>
                        </div>
                        <div className={css.hbNum}>{"航班: "+data.journeys[0].air_comp}</div>
                    </div>
                    {this.createTripItem(item)}
                </div>:
                    <div className={css.flightPlan} style={{borderBottom:"1px solid #999999"}}>
                        <div className={css.row}>
                            <div className={css.left}>
                                <div className={css.sign}></div>
                            </div>
                            <div className={css.right}>航班计划</div>
                        </div>

                        <div className={css.mhNum}>{"航班: 待定"}</div>
                        <div className={css.mhNum}>{data.route.daynight.replace(",","天")+'晚'+" 不含周末"}</div>
                    </div>
                }
                {item?
                <div className={css.flightPlay}>
                    <div className={css.right}>往返机场</div>
                    <div>
                        <p>{item?item[0].depart_city:''}
                        <span>{item?item[0].depart_airport:''}</span>
                           <img className={css.flightArrow} src={this.img_tripDoubleArrow} />
                            {item?item[1].depart_city:''}
                            <span>{item?item[1].depart_airport:''}</span>
                        </p>
                    </div>
                </div>:null}

            </div>
        );
        return itemView;
    }
    createTripItem(arr){
        if (!arr||arr.length<1){
            return (<div></div>);
        }
        var itemArr = [];
        for(let i=0;i<arr.length;i++){
            var item = arr[i];
            var item = ((
                <div key={"Trip"+i}>
                    <div className={css.time}>
                        <div className={css.goPlay}>
                            <div className={i == 0 ? css.hg : css.yh} style={{
                                backgroundImage: `url(${i == 0 ? this.img_start : this.img_end})`
                            }}></div>
                            <p className={css.hgTime}>
                                {TimeHelp.getMD(item.dest_time)}
                                <span>(</span>{"周"+TimeHelp.getWeek(item.dest_time)}<span>)</span>
                                <span style={{marginLeft:'0.2rem'}}>{TimeHelp.getHM(item.depart_time)+'-'+TimeHelp.getHM(item.dest_time)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ));
            itemArr.push(item);
        }
        return itemArr;
    }

}

class HeadView extends Component{
    constructor(props) {
        super(props);
        this.img_fj = '/serverImg/fj.png';
        this.img_tripBorder = window.imgHost + '/images/trip_img.png';
    }
    initSwiper(){
        this.Swiper=new Swiper(this.refs.banner, {
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            initialSlide: 0,
            speed: 1000,
            observer: true,
            observeParents: true,
            grabCursor: true,
            pagination: '.swiper-pagination',
            loop:false
        });
    }

    componentDidMount(){
        this.initSwiper();
    }
    render(){
        const data =  this.props.data.route.images;
        return(
            <div className={css.trip}>
                {data.length?
                <div className={css.cityImg} style={{
                    backgroundImage: `url(${this.img_tripBorder})`
                }}>
                    <div className="slider-touch" ref="banner" style={{width:'100%',height:'100%',overflow:'hidden'}} data-plugn="swiper">
                        <ul className="swiper-wrapper" style={{width:"1000%"}}>
                            {
                                data.map((item,i)=>{
                                    return <li className="swiper-slide"  style={{width:'10%',float:'left'}} key={i}>
                                        <img className={css.SWImg} src={item}  />
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    {data.length>1?<div className="swiper-pagination" style={{left:'0',right:'0',top:'4.8rem'}}></div>:
                        <div className="swiper-pagination" style={{display:'none'}}></div>}
                </div>:null}
            </div>
        );}
}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
