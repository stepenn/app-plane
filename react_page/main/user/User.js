/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import CellView from '../cell/CellItem.js';
import css from './User.less';
import HelpI from '../../help/Help.js';
import CookieHelp from '../../tool/CookieHelp.js'
import ScrollView from  '../../component/ScrollDiv/ScrollDivCom.js';
import ImageLoad from '../../component/ImageLoad/index.js';
import Toast from '../../component/Toast/index.js';
import SelectAlert from '../../component/Dialog/Select/index.js'

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();

        this.state = {
            upData:0,
        }
        this.img_headRing = window.imgHost + '/images/bg_head_ring.png';
        this.img_huizhang = window.imgHost + '/images/huizhang.png';
        this.img_flag = window.imgHost + '/images/img_flag.png';
        this.img_myTrip = window.imgHost + '/images/icon_bag.png';
        this.img_planeMember = window.imgHost + '/images/img_group.png';
        this.img_envelop = window.imgHost + '/images/icon_envelop.png';
        this.img_set = window.imgHost + '/images/icon_set.png';
        this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
        this.icon_male = window.imgHost + '/images/icon_man.png';
        this.icon_female = window.imgHost + '/images/icon_woman.png';
        this.img_msg = window.imgHost + '/images/icon_msg.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }
    openPage(path,option){
        if (!CookieHelp.getUserInfo()){
            this.login();
            return;
        }
        this.Help.app_open(this, path,option)
    }
    //进入我的领队列表
    goMyTeamList(){
        var userInfor = CookieHelp.getUserInfo();
        if (userInfor.status==3){
            this.openPage("/MyTeam", {
                title: "我的领队",
            });
        }else if(userInfor.status==1){
            Toast.showToast('您已提交领队审核,3个工作日内给出结果,请注意查看...');
        }else {
            SelectAlert.open((yes)=>{
                this.selectYes = yes;
            },{
                title:"温馨提示",
                content:"您还不是领队点击申请成为领队",
                quit:"取消",
                sure:"申请",
                isShow:true,
            },()=>{
                //关闭之后
                if (this.selectYes) {
                    this.Help.app_open(this, '/VerTeamer', {
                        title: '领队认证',
                        callBack: (isFinish) => {
                            if (isFinish) {

                            }
                        }
                    })
                }
                this.selectYes = undefined;
            });
        }
    }

    getActionData(){
        return [
            {
                title: "我的领队",
                src: this.img_flag,
                show_icon: true,
                onClick:()=>{
                    this.goMyTeamList();
                }
            },
            {
                title: "我的行程",
                src: this.img_myTrip,
                show_icon: true,
                onClick:()=>{
                    this.openPage("/MyTrip", {
                        title: "我的行程",
                    });
                }
            },
            {
                title:"我的乘机人",
                src: this.img_planeMember,
                show_icon:true,
                onClick:()=> {
                    this.openPage("/MyPlane", {
                        title: "我的乘机人",
                    });
                }
            },
            {
                title:"意见反馈",
                src:this.img_envelop,
                show_icon:true,
                onClick:()=> {
                    this.openPage("/Feedback", {
                        title: "意见反馈",
                    });

                }
            },
            {
                title:"设置",
                src:this.img_set,
                show_icon:true,
                onClick:()=> {
                    this.openPage("/Setting", {
                        title: "设置",
                        callBack:(isFinish)=>{
                            if (isFinish){
                                this.Help.setIntent(true);
                                this.Help.back(this);
                                // this.upView();
                            }
                        }
                    });

                }
            }
        ];
    }
// {
//     title:"我的分期",
//     src:require("./images/pay.png"),
//     show_icon:true,
//     onClick:()=> {
//         Toast.showToast("暂未开通")
//         return;
//         this.openPage("/MyPeriodization", {
//             title: "我的分期",
//         });
//     }
// },
    getActionList(data){
        var listView = [];
        let size = data.length;
        for(var i=0;i<size;i++){
            let index = i;
            let dataItem = data[i];
            var mainItme= (
                <CellView key={index} onClick={()=> {
                    dataItem.onClick();
                }} item={dataItem}/>
            );
            if(i==0||i==1||i==3){
                listView.push(
                    <div key={index}>
                        <div className={css.line} />
                        {mainItme}
                    </div>
                );
            }else{
                listView.push(mainItme);
            }

        }
        return listView;
    }
    createSign(tags){
        if (!tags){
            return null;
        }
        var dataSign = tags.split(",");
        var signArr =[];
        for(var i = 0;i<dataSign.length;i++){
            let index = i;
            var signView = (<div key={index} className={css.signContent}>{dataSign[index]}</div>);
            signArr.push(signView);
        }
        return signArr;
    }

    login() {
        this.Help.app_open(this, "/Login", {
            title: "登录",
            callBack:(isFinish)=>{
                if (isFinish){
                    this.upView();
                }
            }
        })
    }
    render() {
       var userInfo =  CookieHelp.getUserInfo();
        var div = (
            <ScrollView className={css.main}>
                {/*头图片*/}
                <div className={css.headLayout}>
                    {this.createHead(userInfo)}

                    <div className={userInfo&&userInfo.tags?css.signArea:css.hidden}>
                        <div className={css.signTitle}>标签:</div>
                        {this.createSign(userInfo&&userInfo.tags?userInfo.tags:"")}
                    </div>
                </div>
                <div className={css.contentLine}>
                    {this.getActionList(this.getActionData())}
                </div>
            </ScrollView>
        );
        return this.Help.app_render(this, div,{actionView:this.createRightBar()});
    }
    //创建头部区域
    createHead(userInfo){
        var headCss=(<div className={css.userline}
                          onClick={()=>{
                              if(userInfo){
                                  // this.Help.app_open(this, "/TicketDetail", {
                                  //     title: "我的资料",
                                  // })
                                  // return;
                                  this.Help.app_open(this, "/UserInfo", {
                                      title: "我的资料",
                                      callBack:(isFinish)=>{
                                          this.Help.setIntent(true);
                                          if (isFinish){
                                              this.upView();
                                          }
                                      }
                                  })
                              }else {
                                  this.login();
                              }
                          }}>
            <div className={css.userIcon}>
                <div className={css.imgCon}>
                    <ImageLoad bg={true}
                               type={1}
                               bgStyle={{borderRadius: "50%"}}
                               src={userInfo?userInfo.avatar:this.img_defaultAvatar}
                               error={this.img_defaultAvatar}/>
                </div>
                <div className={css.bg} style={{
                    backgroundImage:this.Help.getImgUrl(this.img_headRing)
                }}></div>
                <div className={userInfo && userInfo.status == 3 ? css.sign_team : css.hidden} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_huizhang)
                }}></div>
            </div>

            <div className={css.nameLine}>
                <div className={css.userName}>{userInfo?userInfo.nick_name:"请点击登录"}</div>
                <img className={userInfo?css.sex:css.hidden} src={userInfo&&userInfo.gender==1?this.icon_male:this.icon_female}/>
            </div>
        </div>);
        return headCss;
    }
    createRightBar(){
        return (<div></div>);
        var actionView = (
            <div className={css.bar_action} onClick={()=>{
                alert("消息通知")
                // this.Help.app_open(this, "/Regist", {
                //     title:"我的消息",
                //     callBack:()=>{
                //
                //     }
                // });
            }}>
                <img src={this.img_msg} className={css.img_message}/>
                <div className={css.sign_message}></div>
            </div>);
        return actionView;
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;