/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
var Help = new HelpI();
/**
 * 带导航的页面
 */
class page extends Component {

    render() {
        var div = (
            <div >
                <div>
                    <div>这是带导航的页面</div>
                    <div>{"标题:"+Help.app_getParameter(this).title}</div>

                </div>
                {this.props.children}
            </div>
        );
        return Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;