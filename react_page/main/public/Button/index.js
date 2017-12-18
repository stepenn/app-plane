/**
 * Created by lixifeng on 17/5/29.
 */
import React, {Component} from 'react';
import css from './index.less';
class index extends Component{
    constructor(props) {
        super(props);
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.img_label = window.imgHost + '/images/bg_label.png';
    }
    render(){

        var {type,children} = this.props;
        var cssV = null;
        var bgStyle = {};
        if(type==1){
            cssV = css.button1;
            bgStyle = {backgroundImage:`url(${this.img_label})`}
        }else{
            cssV = css.button2;
            bgStyle = {backgroundImage: `url(${this.img_submit})`}
        }
        return(
            <div {...this.props} className={cssV} style={bgStyle}>
                   {children}
               </div>
        );
    }
}
module.exports = index;