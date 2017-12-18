/**
 * @module DatePicker Component
 */

import React, { Component, PropTypes } from 'react';
import SelectDataItem from './SelectDataItem.js';
import css from './select.css';

/**
 * Class DatePicker Component Class
 * @extends Component
 */
class SelectData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:0,
        }
        this.img_rule = window.imgHost + '/images/bg_board.png';
    }

    getSize(datas,arr,selectArr,value,lastData){
        if(!arr){
            arr = [];
        }
        if(datas&&datas.length>0){
            //取第一个中,是否包含下一级
            //只取其中的title

            let size = datas.length;
            var ds = [];
            var position = 0;
            var arrSize = arr.length;
            var selectArrSize = selectArr.length;
            for(var i=0;i<size;i++){
                var d = datas[i];
                ds.push({
                    title:d.title,
                });
                //当前项是被选择
                if(!(selectArrSize>arrSize)&&d.select){
                        position = i;
                }

            }

            if(selectArrSize>arrSize){
                position = selectArr[arrSize].select;
            }
            //进行下一级添加//注:一个列表中,存在一项目 ,默认第0项,如果有多项,取最后一项

            arr[arrSize] =ds;
            selectArr[arrSize] = {
                select:position,
            };
            lastData.data = datas[position];
            var vv = ds[position]?ds[position].title:"none";
            value.title=value.title+" "+vv;
            return this.getSize(lastData.data?lastData.data.data:null,arr,selectArr,value,lastData);
        }else{
            return arr;
        }
    }
    clearSelect(position,select){
        var size = this.selectArr.length;
        for(var i=0;i<size;i++){

            if(i>position){
                //在此之后,归0
                this.selectArr[i].select = 0;
            }else if(i==position){
                //当前选择,改变
                this.selectArr[i].select = select;
            }else{
                //不修改
            }
        }
    }
    /**
     * render函数
     * @return {Object} JSX对象
     */
    render() {



        //计算有多少级
        if(!this.selectArr){
            this.selectArr = [];
        }
        if(!this.value){
            this.value = {
                title:"",
            };
        }else{
            this.value.title ="";
        }
        if(!this.lastData){
            this.lastData = {};
        }

        var arrData = this.getSize(this.props.datas,null,this.selectArr,this.value,this.lastData);

        //得到显示值
        var dpi_arr = [];
        var cssV = css.datepicker_col_1;
        var size = arrData.length;
        for(var i=0;i<size;i++){
            let position = i;
                dpi_arr.push(
                <SelectDataItem
                    className={cssV}
                    key={"key"+i}
                    onSelect={(index)=>{
                        this.clearSelect(position,index);
                        //当前之后的归于0
                        this.setState(
                            {
                                index:index,
                            }
                        );
                    }}
                    currentIndex={this.selectArr[position].select}
                    datas={arrData[i]} />

            )
        }
        return (
        <div
            onClick={()=>{
                this.props.onCancel();
            }}
            className={css.datepicker_modal}>
                <div className={css.android} style={{
                    backgroundImage: `url(${this.img_rule})`
                }}>
                <div className={css.datepicker_headerTable}>
                    <div className={css.datepicker_header}>{this.value.title}</div>
                </div>

                <div className={css.datepicker_content}>
                    {dpi_arr}
                </div>
                <div className={css.datepicker_navbar}>

                    <div
                        className={css.datepicker_navbar_btn}
                        onClick={(e)=>{
                            this.props.onCancel();
                            try{
                                e.nativeEvent.stopImmediatePropagation()
                                e.stopPropagation();
                                e.preventDefault();
                                e.cancelBubble=true
                            }catch (error){
                            }
                        }}>取消</div>

                    <div
                        className={css.datepicker_navbar_btn}
                        onClick={(e)=>{
                            try{
                                e.nativeEvent.stopImmediatePropagation()
                                e.stopPropagation();
                                e.preventDefault();
                                e.cancelBubble=true
                            }catch (error){
                            }

                            if (typeof(this.lastData.data) == "undefined") {
                                return;
                            }
                            if(this.props.onSelect){
                                this.props.onSelect(this.value.title,this.selectArr,this.lastData.data);
                            }
                        }}>完成</div>
                </div>
            </div>
        </div>
        );
    }
 }
export default SelectData;
