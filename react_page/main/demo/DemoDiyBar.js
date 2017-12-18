/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
/**
 * 自定义导航的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    render() {
        var div = (
            <div >
                <div>
                    <div>这是带导航的页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                </div>
                <div
                    style={{color:"#ff0000"}}
                    onClick={()=>{
                        this.Help.back(this);
                    }}
                >返回</div>
            </div>
        );
        var barView = (
            <div>
                你好,这是我自己的导航,我就是不返回页面
            </div>
        );
        return this.Help.app_render(this,div,{barView:barView});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;