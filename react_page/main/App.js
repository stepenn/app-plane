/**
 * Created by lixifeng on 17/3/24.
 */
import React, { Component } from 'react';

import css from './App.less';
import HelpI from '../help/Help.js';
import Index from './index/Index.js';
import ApinSelect from '../component/Dialog/ApinSelect/index';
import SocialBar from './social/SocialBar.js';
import User from './user/User.js';
import CookieHelp from '../tool/CookieHelp.js';
import HttpTool from '../http/HttpTool.js';
import APIGYW from '../http/APIGYW.js';
import ClickHelp from '../tool/ClickHelp.js';
import Toast from '../component/Toast/index.js';
import LoadWX from '../tool/LoadWX.js'
import GuidePage from './GuidePage'

import AudioHelp from '../tool/AudioHelp';
// 是否首次启动app 控制是否显示引导页


class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.Help.setPageAnimOption(null);
        this.appAudio = new AudioHelp('App'); // play audio for first load App
        this.myTeamAudio = new AudioHelp('MyTeam'); // play audio for leader part
        // CookieHelp.saveCookieInfo('isFirstBeLeader', 1);
        this.state = {
            show: false,
            firstLoad: this.isFirstLoad()
        };
        this.img_Myteam = window.imgHost + '/images/img_flag.png';
        this.img_msg = window.imgHost + '/images/icon_msg.png';
        this.img_profile = window.imgHost + '/images/img_profile.png';

        LoadWX.initWXShare(() => {
            // alert("分享成功");
        }, (e) => {
            // alert(JSON.stringify(e))
        });

    }

    isFirstLoad() {

        var firstLoad = CookieHelp.getCookieInfo('firstLoad')
        if (window.plus) {
            return firstLoad == null // if page work in app check firstLoad exist
        } else {
            return false; // launch splash keep hide
        }


    }

    saveFirstLoad() {
        this.appAudio.play('FirstEnter');
        CookieHelp.saveCookieInfo('firstLoad', 1)
    }

    getUrlSearch(str) {
        var query = {};
        var name, value;
        var num = str.indexOf("?")
        if (num < 0) {
            return query;
        }

        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        var arr = str.split("&"); //各个参数放到数组里

        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                query[name] = value;
            }
        }
        return query;
    }

    componentDidMount() {
        //设置定时器

        this.upDataUserInfo();
        //判断,是否需要跳转页面
        //https://a.com?open=YUIOKFJDKSJFKDS
        //{path:"/test",parame:{id:1}}
        //?open={"path":"/TripDetails","parame":{"route_id":"ada"}}
        log(window.location);
        var query = this.getUrlSearch(window.location.search);
        if (!query.open) {
            return;
        }
        var jsonStr = decodeURIComponent(query.open);
        var json = null;
        try {
            json = JSON.parse(jsonStr);
        } catch (e) {
            return;
        }
        if (!json.path) {
            return;
        }
        this.Help.app_open(
            this, json.path, json.parame
        );
        // setTimeout(() => {
        //     this.Help.app_open(
        //         this, json.path, json.parame
        //     );
        // }, 200)


    }

    componentWillUnmount() {

        this.appAudio.stop(); // remember to stop audio player
    }

    //提交修改数据
    upDataUserInfo() {
        var userInfo = CookieHelp.getUserInfo();
        //没有登录
        if (!userInfo) {
            return;
        }
        var param = {}
        var successCallback = (code, message, json, option) => {
            // when user current status is initial (0) or waiting for pass (1)
            if (userInfo.status < 2) {
                if (json.status == 2) { // fail
                    // set cookie to 1 to make failure audio
                    CookieHelp.saveCookieInfo('isFirstBeLeader', 1);
                } else if (json.status == 3) { // success
                    // set cookie to 2 to make first success audio
                    CookieHelp.saveCookieInfo('isFirstBeLeader', 2);
                }
            }
            CookieHelp.saveUserInfo(json);
        };
        var failCallback = (code, message) => {
        };
        HttpTool.post(APIGYW.api_user_userInfo, successCallback, failCallback, param);


        setTimeout(()=>{
            this.upDataUserInfo();
            },1000*60*5)
    }
    switch() {
        this.setState({
            show: !this.state.show,
        })
    }

    render() {
        if (this.state.firstLoad) {
            return this.renderGuidePage()
        } else {
            return this.renderMain()
        }
    }


    renderGuidePage() {
        return <GuidePage go={() => {
            this.setState({ firstLoad: false })
            this.saveFirstLoad()
        }} />
    }
    renderMain() {
        var div = (
            <div >
                <Index />
                <div className={css.demo}
                    onClick={() => {
                        this.Help.app_open(this, "/Demo")
                    }}
                >演示
                </div>
                <div className={css.leaderTeam} onClick={(e) => {
                    var exe = () => {
                        ClickHelp.stopClick(e)
                        this.openApply();
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
                }}>
                    <img className={css.myTeam} src={this.img_Myteam} />
                    我的领队
                </div>
                <div className={css.goList}>
                    <div className={css.blockSelect} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_msg),
                    }}
                        onClick={() => {
                            var exe = () => {
                                this.Help.app_open(this, "/SocialBar", { title: "爱拼战友" })
                            }
                            var userInfo = CookieHelp.getUserInfo();
                            if (!userInfo) {
                                this.Help.app_open(this, "/Login", {
                                    title: "登录", callBack: (state) => {
                                        // if (state) {
                                        //     exe();
                                        // }
                                    }
                                })
                            } else {
                                exe();
                            }
                        }}
                    >
                    </div>
                    <div className={css.blockSelectSec} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_profile)
                    }}
                        onClick={() => {
                            var exe = () => {
                                this.Help.app_open(this, "/User", {
                                    title: "用户中心",
                                })
                            }
                            var userInfo = CookieHelp.getUserInfo();
                            if (!userInfo) {
                                this.Help.app_open(this, "/Login", {
                                    title: "登录", callBack: (state) => {
                                        // if (state) {
                                        //     exe();
                                        // }
                                    }
                                })
                            } else {
                                exe();
                            }
                        }}
                    >
                    </div>

                </div>
            </div>
        );

        return this.Help.app_render(this, div, { full: true });
    }
    //点击初次登录，判断用户是否成为领队
    openApply() {
        //登陆
        var userInfo = CookieHelp.getUserInfo();
        if (!userInfo) {
            this.Help.app_open(this, '/Login', {
                title: '登陆',
                callBack: (isFinish) => {
                    // if (isFinish) {
                    //     this.openApply();
                    // }
                }
            })
        } else {
            var status = userInfo.status, isFirstBeLeader = CookieHelp.getCookieInfo('isFirstBeLeader');
            if (status == 3) {
                isFirstBeLeader ? (
                    // if leader cookie record cookie is 2 indicate first become Leader, play success audio
                    isFirstBeLeader == 2 ? (this.myTeamAudio.play('reqSuccess'),
                        CookieHelp.saveCookieInfo('isFirstBeLeader', 0)) : void 0
                ) : void 0;
                this.Help.app_open(this, '/MyTeam', {
                    title: '我的领队',
                })
            } else {
                if (status == 1) {
                    Toast.showToast('您已提交领队审核,3个工作日内给出结果,请注意查看...');
                } else {
                    isFirstBeLeader ? (
                        // if value is 1 indicates failure, play failure audio
                        isFirstBeLeader == 1 ? (this.myTeamAudio.play('reqFailure'),
                            CookieHelp.saveCookieInfo('isFirstBeLeader', 0)) : void 0
                    ): void 0;
                    ApinSelect.open((yes) => {
                        this.selectYes = yes;
                    }, {
                            content: "您还不是领队点击申请成为领队",
                            confirm: '取消',
                            cancel: '申请'
                        }, () => {
                            if (this.selectYes) {
                                this.Help.app_open(this, '/VerTeamer', {
                                    title: '领队认证',
                                    callBack: (isFinish) => {

                                    }
                                })
                            }
                            this.selectYes = undefined;
                        });
                }
            }
        }
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;