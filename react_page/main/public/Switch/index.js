/**
 * Created by lixifeng on 17/5/29.
 */
import React, {Component} from 'react';
import css from './index.less';
import ClickHelp from '../../../tool/ClickHelp.js';
/*
* isEventsThrough 是否可以事件穿透
* defaultSelect 默认选择
*
* */
class index extends Component{
    constructor(props){
        super(props);
        this.isEventsThrough = props.isEventsThrough;
        this.state = {
            select:this.props.defaultSelect,
        }
        if(this.props.select){
            this.props.select(this.state.select);
        }
       if( this.props.setSwitch){
           this.props.setSwitch(this.setSwitch.bind(this));
       }
       this.img_switchOn = window.imgHost + '/images/icon_switchOn.png';
       this.img_swtichOff = window.imgHost + '/images/icon_switch.png';
    }


    // 组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。
    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultSelect!=this.props.defaultSelect) {
           this.setSwitch(nextProps.defaultSelect);
        }
    }

    setSwitch(select){
        this.setState({
            select:select,
        });
    }
    render(){
        var callBack =()=>{};
        if (this.isEventsThrough){
            callBack = ()=>{
                var select = !this.state.select;
                this.setSwitch(select);
                if(this.props.select){
                    this.props.select(select);
                }
            }
        }else {
            callBack = (e)=>{
                if(this.props.noClick){
                    return;
                }
                ClickHelp.stopClick(e);
                var select = !this.state.select;
                this.setSwitch(select);
                if(this.props.select){
                    this.props.select(select);
                }
            }
        }
        return(
            <div className={this.state.select?css.switchA:css.switch}

                style={{
                    backgroundImage: `url(${ this.state.select ?
                        this.img_switchOn : this.img_swtichOff })`
                }} onClick={callBack}
            />
        );
    }
}
module.exports = index;