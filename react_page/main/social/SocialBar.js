/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import css from './SocialBar.less';
import HelpI from '../../help/Help.js';

import Desire from './desire/Desire.js';
import Message from './message/Message.js';
import Friends from './friends/Friends.js';


class page extends Component {
    
    constructor(props) {
        super(props);

        this.Help = new HelpI();
        this.state = {
            index:0,
        };
        this.barArr = ["愿望池","消息","通讯录"];

        if(!this.callbacks){
            this.callbacks = [];
        }
        if(!this.pageArrView) {
            this.pageArrView = [];
        }
        let size = this.barArr.length;
        for(var i=0;i<size;i++){
            //初始默认值
            this.callbacks.push(()=>{});
            this.pageArrView.push(<div>none</div>)
        }


        this.pageArrView[0] = (<Desire
            selectCall={(callback)=>{
                this.callbacks[0] = (callback);
                this.select(0);
            }}
        />)
        this.pageArrView[1] = (<Message
            selectCall={(callback)=>{
                this.callbacks[1] = (callback);
            }}
        />)
        this.pageArrView[2] = (<Friends
            selectCall={(callback)=>{
                this.callbacks[2] = (callback);
            }}
        />)
        this.img_label = window.imgHost + '/images/bg_label.png';
    }

    componentDidMount() {

    }
    select(i) {
        //被选择
        this.callbacks[i](true);
    }
    render() {

        var barArrView = [];
        var mainArrView = [];
        for(let i in this.barArr){
            let select = this.state.index == i,
                bgStyle = select ? { backgroundImage: `url(${this.img_label})` } : {};
            barArrView.push(
                <div key={i} style={bgStyle}
                    className={[css['tab'], select ? css['tab__selected'] : ''].join(' ')}
                    onClick={()=>{
                        this.setState({
                            index:i,
                        });
                        this.select(i);
                    }}
                >{this.barArr[i]}</div>
            )

            mainArrView.push(
                <div
                    key={i}
                    className={select?css.mainContextA:css.mainContext}
                >
                    {this.pageArrView[i]}
                </div>
            )
        }
        var barView = (
            <div
                className={css.bar_bg}
            >
                {barArrView}
            </div>
        );



        var div = (
            <div className={css.main}>
                {barView}
                {mainArrView}
            </div>
        );
        return this.Help.app_render(this, div, {full: false});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;