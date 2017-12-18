/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
import LoginHelp from '../plus/LoginHelp.js';
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
                    <div>这是登录页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div style={{fontSize:"1rem"}} onClick={()=>{


                        LoginHelp.openLogin((e)=>{},(e)=>{});

                    }}>打开登录</div>
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