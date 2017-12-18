/**
 * Created by apin on 2017/5/25.
 */
import React, {Component} from 'react';
import css from './ItemTicketInfor.less';
import Switch from '../public/Switch/index.js';
import ClickHelp from '../../tool/ClickHelp.js';

class ItemTicketInfor extends Component {
    constructor(props){
        super(props);
        this.state = ({
            isRead:props.isRead,
        })
        if( this.props.setSwitch){
            this.props.setSwitch(this.setSwitch.bind(this));
        }

        this.img_inputPW = window.imgHost + '/images/input_PW.png';
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
    }
    setSwitch(select){

        this.setSwitchForView(select)
    }


    render() {
        var {ticketInforAct,isReadCallBack,isRead} = this.props;

        var itemView = (
            <div {...this.props}>
                <div className={css.lineRow} style={{
                    backgroundImage: `url(${this.img_inputPW})`
                }} onClick={(e)=>{
                    ClickHelp.stopClick(e);

                    ticketInforAct();
                }}>
                    <div className={isReadCallBack?css.img:css.hidden}>
                        <Switch
                                defaultSelect={isRead}
                                setSwitch={(fun)=>{
                                    this.setSwitchForView = fun;
                                }}
                                select={(select) => {
                                     if (isReadCallBack) {
                                      isReadCallBack(select);
                                   }
                                }}

                        />
                    </div>

                    <div className={isReadCallBack?css.lineTitle:css.refLineTitle}>起航小贴士</div>
                    <div className={css.lineImg}>
                        <img className={css.myImg} src={this.img_rightArrow}/>
                    </div>
                </div>
            </div>
        );
        return itemView;
    }
}
module.exports = ItemTicketInfor;