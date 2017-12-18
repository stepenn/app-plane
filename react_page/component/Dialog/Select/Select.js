/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './Select.css';
import ClickHelp from '../../../tool/ClickHelp.js';

class Select extends Component {
    constructor(props){
        super(props);
        this.img_dialog = this.getImgUrl(window.imgHost+"/images/img_dialog.png")
    }
    getImgUrl(url) {
        if(url){
            return `url(${url})`;
        }else{
            return null;
        }

    }
/*
* title:标题
* content:提示内容
* quit:取消按钮
* sure:确定按钮
* isShow:控制按钮是否显示
*/

    render() {
        var {
            title,
            content,
            quit,
            sure,
            isShow,
        } = this.props.option;

        var title_v = "请选择";
        if (title) {
            title_v = title;
        }
        var contentView = null;
        if (content) {
            contentView = (
                <div className={css.content}>
                    {content}
                </div>
            );
        }else{
            contentView = (
                <div className={css.contentNone}>
                </div>
            );
        }

        return (
            <div className={css.bg}
                 onClick={() => {
                     this.close();
                 }}
            >
                <div className={css.main}
                     style={{
                         backgroundImage: this.img_dialog
                     }}

                     onClick={(e) => {
                         ClickHelp.stopClick(e);
                     }}
                >
                    <div className={css.top}> {title_v}</div>
                    {contentView}

                    <div className={css.bottom}>
                        <div className={isShow?css.button:css.hidden}
                             onClick={() => {
                                 if (this.props.callBack) {
                                     this.props.callBack(false);
                                 }
                                 this.close();
                             }}
                        >{quit?quit:"取消"}
                        </div>
                        <div className={isShow?css.button_1:css.refButton_1}
                             onClick={() => {
                                 if (this.props.callBack) {
                                     this.props.callBack(true);
                                 }
                                 this.close();
                             }}
                        >{sure?sure:"确定"}
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