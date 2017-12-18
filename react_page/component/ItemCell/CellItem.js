/**
 * Created by Administrator on 2016/10/31.
 */
import React, {Component} from 'react';
import css from './CellItem.css';

class CellItem extends Component {
    constructor(props){
        super(props);
        this.img_right  = require("./right_click_icon.png");
    }
    render() {
        // img/user/right_click_icon.png
        // show_icon 只有传true时,左右的item小图标才会出现 否则消失
        // src左边的小图片
        // title标题
        var {item}=this.props;
        // item.show_icon 左边图片
        // title
        // rightTitle

        var cssImg = item.show_icon ? css.cellimg_icon_show : css.cellimg_icon_hidden;
        var cssImgItem = item.show_icon ? css.cellItem_show : css.cellItem_hidden;
        var csstitle = item.show_icon ? css.celltitle_show : css.celltitle_hidden;
        var leftIcon = null;
        if(item.show_icon){
            leftIcon =
                <div className={css.imgLeft}
                     style={{
                         backgroundImage: 'url('+item.src+')',
                     }}
            />;
        }
        var cell = (
            <div
                {...this.props}
                className={css.cell}>
                <div className={css.cellMain}>
                    {leftIcon}
                    <div
                    className={item.show_icon?css.center:css.centerLeftNone}
                    >
                        <div className={css.inLine}>
                            {item.title}
                        </div>
                        <div className={css.inLineRight} style={item.titleRightStyle}>
                            {item.titleRight}
                        </div>
                    </div>
                    <div className={css.imgRight}
                         style={{
                             backgroundImage: 'url('+this.img_right+')',
                         }}
                    />
                </div>

            </div>
        );
        return cell
    }
}
module.exports = CellItem;