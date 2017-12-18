/**
 * @module DatePicker Component
 */

import React, { Component, PropTypes } from 'react';
import DatePickerItem from './DatePickerItem.js';
import PureRender from './pureRender.js';
import { convertDate, nextDate } from './time.js';
import css from './time.css';

/**
 * Class DatePicker Component Class
 * @extends Component
 */
class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: nextDate(this.props.value),
        };
        this.img_rule = window.imgHost + '/images/bg_board.png';
        this.typeNames = ["Year",'Month','Date','Hour','Min'];
        this.handleFinishBtnClick = this.handleFinishBtnClick.bind(this);
        this.handleDateSelect = this.handleDateSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // update value of state
        const date = nextDate(nextProps.value);
        if (date.getTime() !== this.state.value.getTime()) {
            this.setState({ value: date });
        }
    }

    /**
     * Optimization component, Prevents unnecessary rendering
     * Only props or state change or value before re-rendering
     *
     * @param  {Object} nextProps next props
     * @param  {Object} nextState next state
     * @return {Boolean}          Whether re-rendering
     */
    shouldComponentUpdate(nextProps, nextState) {
        const date = nextDate(nextState.value);
        return date.getTime() !== this.state.value.getTime() ||
                PureRender.shouldComponentUpdate(nextProps, nextState, this.props, this.state);
    }

    /**
     * 点击完成按钮事件
     * @return {undefined}
     */
    handleFinishBtnClick() {
        this.props.onSelect(this.state.value,this.showTimeValue);

    }

    /**
     * 选择下一个日期
     * @return {undefined}
     */
    handleDateSelect(value) {
        this.setState({ value });
    }

    /**
     * render函数
     * @return {Object} JSX对象
     */
    render() {
        const { min, max, theme, dateFormat ,headFormat} = this.props;
        const value = this.state.value;
        const themeClassName =
            ['default', 'dark', 'ios', 'android', 'android-dark'].indexOf(theme) === -1 ?
            'default' : theme;


        let dpi_arr = [];
        var headFormatValue = "";

        let addHeadFor = headFormat === "default";

        let size = dateFormat.length;
        for(var i=0;i<size;i++){

            let dataForValue = dateFormat[i];
            if(addHeadFor){
                headFormatValue= headFormatValue + dataForValue;
            }

            var cssV = null;
            if(!dataForValue||dataForValue===""){
                cssV= css.datepicker_col_1_none;
            }else{
                cssV= css.datepicker_col_1;
            }
            dpi_arr.push(
                <DatePickerItem
                    className={cssV}
                    key={"key"+i}
                    value={value}
                    min={min}
                    max={max}
                    typeName={this.typeNames[i]}
                    format={dataForValue}
                    onSelect={this.handleDateSelect} />

            )
        }
        if(!addHeadFor){
            headFormatValue = headFormat;
        }
        this.showTimeValue = convertDate(value, headFormatValue);

        return (
            <div
                className={css.android} style={{
                backgroundImage: `url(${this.img_rule})`
            }}>
                <div className={css.datepicker_header}>{this.showTimeValue}</div>
                <div className={css.datepicker_content}>
                    {dpi_arr}
                </div>
                <div className={css.datepicker_navbar}>

                    <div
                        className={css.datepicker_navbar_btn}
                        onClick={()=>{
                            this.props.onCancel();
                        }}>取消</div>

                    <div
                        className={css.datepicker_navbar_btn}
                        onClick={()=>{
                            this.handleFinishBtnClick();
                        }}>完成</div>
                </div>
            </div>
        );
    }
 }

DatePicker.propTypes = {
    theme: PropTypes.string,
    value: PropTypes.object,
    min: PropTypes.object,
    max: PropTypes.object,
    dateFormat: PropTypes.array,
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
};

export default DatePicker;
