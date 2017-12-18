/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './Select.css';
import ClickHelp from '../../../tool/ClickHelp.js';
class Select extends Component {
    constructor(props) {
        super(props);
        this.img_fact = window.imgHost + '/images/fact.png';
        this.img_wait = window.imgHost + '/images/fact.png';
        this.img_dialog = window.imgHost + '/images/img_dialog.png';
    }

    render() {
        var {
            content,
            confirm,
            cancel,

        } = this.props.option;

        var more="",sure='';
        if(confirm){
            more = confirm;
        }
        if(cancel){
            sure = cancel;
        }
        var contentView = null;
        if (content) {
            contentView = (
                <div className={css.content}>
                    {content}
                </div>
            );
        }else{
            contentView = '';
        }

        return (
            <div className={css.bg}
                 onClick={(e) => {
                     this.close();
                     ClickHelp.stopClick(e);
                 }}
            >
                <div className={css.box}>
                    <div className={css.main} style={{
                        backgroundImage: `url(${this.img_dialog})`
                }} onClick={(e) => {
                         ClickHelp.stopClick(e);
                     }}
                >
                    {contentView}
                </div>
                <div className={css.bottom}>
                    <div className={css.button} style={{
                        backgroundImage: `url(${this.img_wait})`
                    }} onClick={(e) => {
                             if (this.props.callBack) {
                                 this.props.callBack(false);
                             }
                             this.close();
                             ClickHelp.stopClick(e);
                         }}
                    >{more}
                    </div>
                    <div className={css.button_1} style={{
                        backgroundImage: `url(${this.img_fact})`
                    }} onClick={(e) => {
                             if (this.props.callBack) {
                                 this.props.callBack(true);
                             }
                             this.close();
                             ClickHelp.stopClick(e);
                         }}
                    >{sure}
                    </div>
                </div>
                </div>
            </div>

        )
    }


    close() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
}
module.exports = Select;