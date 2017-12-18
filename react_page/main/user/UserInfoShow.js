/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    render() {
        var div = (
            <div style={{background:"#ffaaff"}}>

                <div >
                    <div>这是其他人看用户信息资料页面</div>
                    <div
                    onClick={()=>{
                        this.Help.app_open(this, "/MessageInfo",{title:"小马"})
                    }}
                    >点击,可和他聊天</div>
                </div>

            </div>
        );
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;