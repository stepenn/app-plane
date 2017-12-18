
/**
 * @module Date组件
 */
import React, { Component, PropTypes } from 'react';
import css from './select.css';
import {
    TRANSITION,
    TRANSFORM,
    TRANSFORM_CSS,
} from './transition';

const DATE_HEIGHT = 40;                              // 每个日期的高度

/**
 * Class Date组件类
 * @extends Component
 */
class SelectDataItem extends Component {
    constructor(props) {
        super(props);
        this.animating = false;                 // 判断是否在transition过渡动画之中
        this.touchY = 0;                        // 保存touchstart的pageY

        //默认第几个
        if(this.props.currentIndex){
            this.currentIndex = this.props.currentIndex;
        }else{
            this.currentIndex = 0;
        }

        this.DATE_LENGTH = this.props.datas.length;
         // 滑动中当前日期的索引
        this.translateY = -this.currentIndex*DATE_HEIGHT;                    // 容器偏移的距离
        //默认选择第X个

        this.state = {
            translateY: this.translateY,
        };

        this.renderDatepickerItem = this.renderDatepickerItem.bind(this);
        this.handleContentTouch = this.handleContentTouch.bind(this);
        this.handleContentMouseDown = this.handleContentMouseDown.bind(this);
        this.handleContentMouseMove = this.handleContentMouseMove.bind(this);
        this.handleContentMouseUp = this.handleContentMouseUp.bind(this);
    }

    componentWillMount() {

        this._iniDates();
    }


    componentWillReceiveProps(nextProps) {

        if(this.props.datas){
            this.DATE_LENGTH = this.props.datas.length;
        }

        if(nextProps.currentIndex==this.currentIndex){
            return true;
        }else{

            this.currentIndex = nextProps.currentIndex;
            this._moveTo(this.refs.scroll, this.currentIndex);
            return false;

        }

        // this._iniDates();
        // this._iniDates(nextProps.value);
        // this.currentIndex = MIDDLE_INDEX;
        // this.setState({
        //     translateY: MIDDLE_Y,
        //     marginTop: (this.currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
        // });
    }

    /**
     * Optimization component, Prevents unnecessary rendering
     * Only value or state change should re-rendering
     *
     * @param  {Object} nextProps next props
     * @param  {Object} nextState next state
     * @return {Boolean}          Whether re-rendering
     */
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    _iniDates(date) {
        if(this.props.onSelect){
            this.props.onSelect(this.currentIndex);
        }
    }

    _updateDates(direction) {
        if (direction === 1) {
            this.currentIndex ++;
            // this.setState({
            //
            //     marginTop: (this.currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
            // });
        } else {
            this.currentIndex --;
            // this.setState({
            //
            //     marginTop: (this.currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
            // });
        }
    }

    _checkIsUpdateDates(direction, translateY) {
        return direction === 1 ?
        this.currentIndex * DATE_HEIGHT + DATE_HEIGHT / 2 < -translateY :
        this.currentIndex * DATE_HEIGHT - DATE_HEIGHT / 2 > -translateY;
    }
    /**
     * 清除对象的transition样式
     * @param  {Dom}     obj     指定的对象
     * @return {undefined}
     */
    _clearTransition(obj) {
        obj.style[TRANSITION] = ''; // eslint-disable-line
    }

    /**
     * 滑动到下一日期
     * @param  {number} direction 滑动方向
     * @return {undefined}
     */
    _moveToNext(direction) {
        // const date = this.state.dates[MIDDLE_INDEX];
        // const { max, min } = this.props;
        // if (direction === -1 && date.getTime() < min.getTime()) {
        //     this._updateDates(1);
        // } else if (direction === 1 && date.getTime() > max.getTime()) {
        //     this._updateDates(-1);
        // }


        this._moveTo(this.refs.scroll, this.currentIndex);
    }

    /**
     * 添加滑动动画
     * @param  {DOM} obj   DOM对象
     * @param  {number} angle 角度
     * @return {undefined}
     */
    _moveTo(obj, currentIndex) {
        this.animating = true;
        obj.style[TRANSITION] = `${TRANSFORM_CSS} .2s ease-out`; // eslint-disable-line
        this.setState({
            translateY: -currentIndex * DATE_HEIGHT,
        });
        setTimeout(() => {
            this.animating = false;
            this.props.onSelect(this.currentIndex);
            //计算,现在的下标位置
            this._clearTransition(this.refs.scroll);

        }, 200);
    }

    handleStart(event) {
        this.touchY = event.pageY || event.targetTouches[0].pageY;
        this.translateY = this.state.translateY;
    }


    handleMove(event) {
        const touchY = event.pageY || event.targetTouches[0].pageY;
        const dir = touchY - this.touchY;
        const translateY = this.translateY + dir;
        const direction = dir > 0 ? -1 : 1;

        // 滑动的最小值  与最大值
        if (translateY>0||translateY<-(this.DATE_LENGTH-1)*DATE_HEIGHT) {
            return;
        }
        // 检测是否更新选项
        if (this._checkIsUpdateDates(direction, translateY)) {
            this._updateDates(direction);
        }

        this.setState({ translateY });

    }

    handleEnd(event) {
        const touchY = event.pageY || event.changedTouches[0].pageY;
        const dir = touchY - this.touchY;
        const direction = dir > 0 ? -1 : 1;
        this._moveToNext(direction);

    }

    /**
     * 滑动日期选择器触屏事件
     * @param  {Object} event 事件对象
     * @return {undefined}
     */
    handleContentTouch(event) {
        event.preventDefault();
        if (this.animating) return;
        if (event.type === 'touchstart') {
            this.handleStart(event);
        } else if (event.type === 'touchmove') {
            this.handleMove(event);
        } else if (event.type === 'touchend') {
            this.handleEnd(event);
        }
    }

    /**
     * 滑动日期选择器鼠标事件
     * @param  {Object} event 事件对象
     * @return {undefined}
     */
    handleContentMouseDown(event) {
        if (this.animating) return;
        this.handleStart(event);
        document.addEventListener('mousemove', this.handleContentMouseMove);
        document.addEventListener('mouseup', this.handleContentMouseUp);
    }

    handleContentMouseMove(event) {
        if (this.animating) return;
        this.handleMove(event);
    }

    handleContentMouseUp(event) {
        if (this.animating) return;
        this.handleEnd(event);
        document.removeEventListener('mousemove', this.handleContentMouseMove);
        document.removeEventListener('mouseup', this.handleContentMouseUp);
    }

    /**
     * 渲染一个日期DOM对象
     * @param  {Object} date date数据
     * @return {Object}      JSX对象
     */
    renderDatepickerItem(value, index) {
        // const className =
        //     (date < this.props.min || date > this.props.max) ?
        //     css.scli_d : css.scli;
        return (
            <li
                key={index}
                className={css.scli}
            >
                {value.title}
            </li>
        );
    }

    render() {
        const scrollStyle = {
            [TRANSFORM]: `translateY(${this.state.translateY}px)`,
            // marginTop: this.state.marginTop,
        };

        var aaa = [];
        var datas =   this.props.datas;
        for(var i=0;i< datas.length;i++){
            aaa.push(
                this.renderDatepickerItem(datas[i],i)
            );
        }
        return (
            <div className={this.props.className}>
                <div
                    className={css.datepicker_viewport}
                    onTouchStart={this.handleContentTouch}
                    onTouchMove={this.handleContentTouch}
                    onTouchEnd={this.handleContentTouch}
                    onMouseDown={this.handleContentMouseDown}>
                    <div className={css.datepicker_wheel}>
                        <ul
                            ref="scroll"
                            className={css.datepicker_scroll}
                            style={scrollStyle}>
                            {aaa}
                        </ul>
                    </div>

                </div>
            </div>
        );
    }
}

SelectDataItem.propTypes = {
    onSelect: PropTypes.func,
};

export default SelectDataItem;
