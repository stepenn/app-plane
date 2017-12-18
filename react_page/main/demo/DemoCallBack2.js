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
        log("页面销毁 第二个页面");
        alert("页面关闭");
        // this.Help.setIntent("哈哈哈");
        this.Help.close(this);

    }
    render() {
        var div = (
            <div >
                <div>
                    <div>这是一个第二级返回</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div
                    style={{color:"#ff0000"}}
                    onClick={()=>{
                        this.Help.setPageAnimOption({type:"right"});
                        this.Help.setIntent("我是二号人物");
                        this.Help.back(this);
                    }}
                >返回上个页面/并带参数(当前页有动画)</div>
                    <div
                        style={{color:"#ff0000"}}
                        onClick={()=>{
                            this.Help.setPageAnimOption(null);
                            this.Help.setIntent("我是二号人物");
                            this.Help.back(this);
                        }}
                    >返回上个页面/并带参数(无当前页动画)</div>
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