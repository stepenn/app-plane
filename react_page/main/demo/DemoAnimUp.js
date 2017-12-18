/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';

/**
 * 不带动画的页面
 */
class page extends Component {

    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.Help.setPageAnimOption({type:"top"});
    }
    animEnd(){

    }
    animEnter(){
        alert("打开页面,动画结束,可以干点别的")
    }

    render() {
        var div = (
            <div >
                <div>
                    <div
                        style={{color:"#ff0000"}}
                        onClick={()=>{
                            this.Help.back(this);
                        }}
                    >返回</div>
                    <div>这是 不带动画的页面页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                </div>
                {this.props.children}
            </div>
        );
        return this.Help.app_render(this,div,{full:true});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;