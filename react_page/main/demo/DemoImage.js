/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
import ImageUp from '../public/ImageUp/index';
/**
 * 测试图片上传的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }


    render() {
        var div = (
            <div >
                <div style={{padding:30}}>
                    <div>这是图片上传页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div style={{fontSize:"1rem"}} onClick={()=>{

                    }}>上传</div>

                    <ImageUp></ImageUp>
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