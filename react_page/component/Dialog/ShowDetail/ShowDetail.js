/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './ShowDetail.css';
import ClickHelp from '../../../tool/ClickHelp.js';
class ShowDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 0,
        };
    }

    render() {
        var {
            title,
            value,
        } = this.props.option;

        var title_v = "详细信息";
        var value_v = "";
        if (title) {
            title_v = title;
        }
        if (value) {
            value_v = value;
        }

        return (
            <div className={css.bg}
                 onClick={() => {
                     this.close();
                 }}
            >
                <div className={css.main}
                     onClick={(e) => {
                         {/*ClickHelp.stopClick(e);*/}
                     }}
                >
                    <div className={css.top}> {title_v}</div>
                    <textarea readOnly="true" ref={"dom"} className={css.content} defaultValue={value_v} type="text"
                    />
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
module.exports = ShowDetail;