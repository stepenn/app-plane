/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';

import LocationHelp from '../plus/LocationHelp.js';
/**
 * 测试定位功能的页面
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
                    <div>这是测试定位页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div style={{fontSize:"1rem"}} onClick={()=>{


                        LocationHelp.openLocation((p)=>{
                            alert("ok:"+JSON.stringify(p))
                        },(e)=>{
                            alert("error:"+JSON.stringify(e))
                        })
                    }}>得到当前定位信息</div>
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