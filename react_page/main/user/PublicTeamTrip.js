/**
 * Created by apin on 2017/6/12.
 */
import React, {Component} from 'react';
import css from './PublicTeamTrip.less';

import HelpI from '../../help/Help.js';
import IndexRight from '../index/IndexRight.js';

class page extends Component {
    constructor(props) {
        super(props);

        if (this.props.selectCall) {
            this.props.selectCall(this.callback.bind(this));
        }
        this.Help = new HelpI();
        this.img_secondBG = window.imgHost + '/images/img_secondBG.jpg';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }

    render() {
        var div = (
            <div className={css.main} style={{
                backgroundImage: this.Help.getImgUrl(this.img_secondBG)
            }}>
                <IndexRight call_Back={(isFinish)=>{
                    if (isFinish){
                        this.Help.setIntent(isFinish);
                        this.Help.back(this);
                    }
                }}/>
            </div>
        );
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;