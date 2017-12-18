/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
import ShareHelp from '../plus/ShareHelp.js';
/**
 * 测试分享的页面
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
                    <div>这是分享页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div style={{fontSize:"1rem"}} onClick={()=>{

                        var host = window.location.origin;
                        var optioin = {
                            title:"发个朋友圈来吸引人",
                            content: "大家好,我最近喜欢上了她!",
                            href: "http://www.w3school.com.cn/i/eg_tulip.jpg",
                            thumbs:[host+"/images/apinlog.png"],
                        }
                        ShareHelp.openShare(()=>{},()=>{},optioin)

                    }}>打开分享</div>
                </div>


            </div>
        );
        return this.Help.app_render(this,div,{full:false});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;