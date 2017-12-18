/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';

/**
 * 带导航的页面
 */
class page extends Component {


    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    
    componentWillUnmount(){
        log("页面销毁 第一个页面");
        this.Help.close(this);
    }
    render() {
        var div = (
            <div >
                <div>
                    <div>这是一个,测试回调数据的页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div
                        style={{color:"#ff0000"}}
                        onClick={()=>{
                            this.Help.setPageAnimOption({type:"right"});
                            this.Help.setIntent(true);
                            this.Help.back(this);
                        }}
                    >返回上个页面/并带参数(有返回动画)</div>
                    <div
                        style={{color:"#ff0000"}}
                        onClick={()=>{
                            this.Help.setPageAnimOption(null);
                            this.Help.setIntent("我回来了 手动");
                            this.Help.back(this);
                        }}
                    >返回上个页面/并带参数(无动画)</div>

                    <div
                        style={{color:"#ff0000"}}
                         onClick={() => {
                             this.Help.app_open(this, "/DemoCallBack2", {
                                 title: '回调数据2',
                                 callBack:(obj)=>{
                                     this.Help.setPageAnimOption(null);
                                     this.Help.setIntent("我回来了 自动");
                                     this.Help.back(this);
                                 }

                             })
                         }}
                    >跳转到两级页面,测试返回返回返回(当前页无动画)
                    </div>
                    <div
                        style={{color:"#ff0000"}}
                         onClick={() => {
                             this.Help.app_open(this, "/DemoCallBack2", {
                                 title: '回调数据2',
                                 callBack:(obj)=>{
                                     {/*alert("下级页面返回"+obj);*/}
                                     log("======AUTO")
                                     this.Help.setPageAnimOption({type:"right"});
                                     this.Help.setIntent("我回来了 自动");
                                     this.Help.back(this);

                                 }

                             })
                         }}
                    >跳转到两级页面,测试返回返回返回(当前页有动画)
                    </div>

                </div>
            </div>
        );
        this.Help.setPageAnimOption({type:"right"});
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;