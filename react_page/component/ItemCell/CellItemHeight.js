/**
 * Created by zhengli on 16/11/11.
 */
import React, {Component} from 'react';
import css from './CellItemHeight.css';

class CellItemHeight extends Component{
    render() {
        // show_icon 只有传true时,左右的item小图标才会出现 否则消失
        // src左边的小图片
        // title标题
        var {item}=this.props;
        var cssImg=item.show_icon?css.cellimg_icon_show:css.cellimg_icon_hidden;
        var cssImgItem=item.show_icon?css.cellItem_show:css.cellItem_hidden;
        var csstitle=item.show_icon?css.celltitle_show:css.celltitle_hidden;
        var cell = (
            <div
                {...this.props}
                className={css.cell}>
                <div className={cssImgItem}>
                    <img className={cssImg} src={item.src}/>
                </div>
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
module.exports =  CellItemHeight;