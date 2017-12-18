/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import css from './Index.less';
import HelpI from '../../help/Help.js';
import IndexLeft from './IndexLeft.js';
import IndexRight from './IndexRight.js';

class page extends Component {
    constructor(props) {
        super(props);

        if (this.props.selectCall) {
            this.props.selectCall(this.callback.bind(this));
        }


        this.Help = new HelpI();
        this.Help.setPageAnimOption(null);
        this.state = {
            index:0,
        };
        this.barArr = ["加入泡泡","发布泡泡"];
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

        this.img_bar = window.imgHost + '/images/img_bar.png';
        this.img_hand = window.imgHost + '/images/img_hand.png';

        this.pageArrView[0] = (<IndexLeft
            selectCall={(callback)=>{
                this.callbacks[0] = (callback);
                this.select(0);
            }}
        />)
        this.pageArrView[1] = (<IndexRight
            selectCall={(callback)=>{
                this.callbacks[1] = (callback);
            }}
        />)
    }

    callback(select) {
        //被选择
        if(select){
           // alert("首页被选择");
        }
    }

    select(i) {
        //被选择
        this.callbacks[i](true);
    }
    render() {

        var barArrView = [];
        var mainArrView = [];
        for(let i in this.barArr){
            let select = this.state.index==i;
            barArrView.push(
                <div
                    key={i}
                    className={this.state.index == i ? css.tableCellA : css.tableCell}
                    style={{
                        backgroundImage: this.Help.getImgUrl(this.state.index == i ? this.img_hand : '')
                    }}
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
            <div className={css.bar_bg}
                style={{
                    backgroundImage: this.Help.getImgUrl(this.img_bar)
                }} >
                {barArrView}
            </div>
        );



        var div = (
            <div className={css.main}>
                {barView}
                {mainArrView}
            </div>
        );
        return div;
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;