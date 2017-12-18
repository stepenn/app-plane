/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
/**
 * 测试调用原生API的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }

    upView(){
    }

    getPushID(){
        window.apinapi("pushMsg",{}, (json)=> {
            alert(JSON.stringify(json));
        }, (error)=> {
            alert(JSON.stringify(error));
        });
    }


    render() {
        var div = (
            <div >
                <div>
                    <div>这是测试调用原生API的页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div style={{fontSize:"1rem"}} onClick={()=>{
                        this.getPushID();
                    }}>获取设备ID</div>
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