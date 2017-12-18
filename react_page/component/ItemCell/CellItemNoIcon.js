/**
 * Created by Administrator on 2016/11/2.
 */
import React, {Component} from 'react';
import css from './CellItemNoIcon.css';

class CellItemNoIcon extends Component{
    render() {
        // show_icon 只有传true时,右边的item小图标才会出现 否则消失
        // title内容
        var {item}=this.props;
        var cssImg=item.show_right_icon?css.cellimg_icon_show:css.cellimg_icon_hidden;
        var cssImgItem=item.show_right_icon?css.cellItem_show:css.cellItem_hidden;
        var csstitle=item.show_icon?css.celltitle_show:css.celltitle_redraw;
        var cell = (
            <div
                {...this.props}
                className={css.cell}>
                <div className={csstitle}>
                    {item.title}
                </div>

                <div className={cssImgItem}>
                    <img className={cssImg} src="images/user/right_click_icon.png"/>
                </div>
            </div>
        );
        return cell
    }
}
module.exports =  CellItemNoIcon;