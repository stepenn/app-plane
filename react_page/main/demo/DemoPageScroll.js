/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import  ScrollView from '../../component/ScrollDiv/ScrollDivCom.js';
import HelpI from '../../help/Help.js';
/**
 * 带导航的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    render() {
        var div = (
            <ScrollView
                style={{
                    background:"#fff000",
                    width:"100%",
                    height:"100%",
                }}
            >
                <div>
                    <div>这个页面,可上下拖动,带感</div>
                    <div>左右拖动,可配置  x:true</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                </div>
            </ScrollView>
        );
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;