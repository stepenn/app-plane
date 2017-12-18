/**
 * Created by apin on 2017/5/26.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './AddSign.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import Toast from '../../../component/Toast/index.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        // this.state = {
        //     numSug:0,
        // };
        this.img_tick = window.imgHost + '/images/img_tick.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    render() {
        var div =  (<ScrollDivV className={css.main}>
            <div className={css.row}>
                <div className={css.left}>自定义标签</div>
                {/*<div className={css.right}>{this.state.numSug + "/6字"}</div>*/}
            </div>
            <input/>
        </ScrollDivV>);

        var actionView = <img src={this.img_tick} className={css.bar_action} onClick={()=>{
            var mySign = this.refs.mySign.value;
            if (mySign.length>6){
                Toast.showToast("最多输入6个字符～");
                return;
            }
            this.Help.setIntent(mySign);
            this.Help.back(this);
        }}/>
        return this.Help.app_render(this,div,{actionView:actionView});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;