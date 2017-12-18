/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import ScrollView from '../../component/ScrollDiv/ScrollDivCom.js';
import css from './Demo.less';
import HelpI from '../../help/Help.js';
class page extends Component {

    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    render() {
        var div = (
            <div className={css.main}  >
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/", {
                             title: '重上来哦',
                         })
                     }}
                >主页
                </div>

                <div className={css.testFont} onClick={() => {
                    this.Help.app_open(this, '/DemoIncreamentUpdate', { title: 'TestIncreamentUpdate' })
                }}>IncreamentUpdateTest</div>

                <div className={css.testFont} onClick={() => {
                    this.Help.app_open(this, "/DemoPlayAudio", { title: 'TestAudioPlayer' })
                }}> AudioPlayTest
                </div>

                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoLoadImage", {title: '调用图片测试'})
                     }}
                >调用图片测试
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoNative", {title: '调用原生API测试'})
                     }}
                >调用原生API测试

                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoImage", {title: '图片上传与显示'})
                     }}
                >跳转到一个图片上传与显示的页面

                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoParameter", {title: '注册'})
                     }}
                >跳转到一个带参数的页面

                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoBar", {title: '注册'})
                     }}
                >跳转到一个带导航的页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoDiyBar", {title: '我自己的导航'})
                     }}
                >跳转到一个自定义导航的页面
                </div>

                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoCallBack", {
                             title: '回调数据',
                             test: "11",
                             callBack: (obj) => {
                                 {
                                     alert("返回:" + obj);
                                 }
                             }
                         })
                     }}
                >跳转到测试回调数据的页面
                </div>

                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoNoAnim", {
                             title: '不带动画哦',
                         })
                     }}
                >跳转到不带动画的页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoAnimUp", {
                             title: '重上面来哦',
                         })
                     }}
                >跳转到TOP动画的页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoPageScroll", {
                             title: '测试滚动页面',
                         })
                     }}
                >跳转到 可上下滑动的页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoPageListView", {
                             title: '测试加载数据页面',
                         })
                     }}
                >跳转到 下拉加载更多数据页面
                </div>
                <input/>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoPageDialog", {
                             title: '弹窗演示页面',
                         })
                     }}
                >跳转到 弹窗演示页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoPageHttp", {
                             title: '网络请求显示页面',
                         })
                     }}
                >跳转到 网络请求显示页面(可跨域)
                </div>
                <br/>

                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoShare", {
                             title: '测试分享页面',
                         })
                     }}
                >跳转到 测试分享页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoLogin", {
                             title: '测试登录页面',
                         })
                     }}
                >跳转到 测试登录页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoLocation", {
                             title: '测试定位页面',
                         })
                     }}
                >跳转到 测试定位页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoPay", {
                             title: '测试支付页面',
                         })
                     }}
                >跳转到 测试支付页面
                </div>
                <div className={css.testFont}
                     onClick={() => {
                         this.Help.app_open(this, "/DemoContacts", {
                             title: '测试获取通讯录页面',
                         })
                     }}
                >跳转到 测试获取通讯录页面
                </div>
            </div>
        );
        // return div;
        return this.Help.app_render(this, div,{full:true});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;