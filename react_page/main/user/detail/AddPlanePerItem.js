/**
 * Created by apin on 2017/5/24.
 */
import React, {Component} from 'react';
import css from './AddPlanePerItem.less';
import HttpTool from '../../../http/HttpTool.js';
import Toast from '../../../component/Toast/index.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import SelectView from "../../../component/Dialog/SelectView/index.js";
import SelectDate from "../../../component/Dialog/SelectDate/index.js";
import TimeHelp from '../../../tool/TimeHelp.js';
import ClickHelp from '../../../tool/ClickHelp.js';

class RowItem extends Component{
    constructor(props){
        super(props);
        this.obj = this.props.obj;


        this.state = {
            upData:0,
            value:this.obj.value,
        }
    }
    upView(){
        this.setState(
            {
                upData:this.state.upData+1,
            }
        );
    }
    render(){
        return (
            <div className={css.cell}>
                <div className={css.line}>
                    <div className={css.left}>
                        <span className={css.leftFont}>
                            {this.obj.title}
                        </span>
                    </div>
                    {this.getChildrenView(this.obj)}
                </div>
            </div>

        );
    }

    callBack(){
        // if(this.props.callBack){
        //     this.props.callBack(this.obj);
        // }

        //调用者
        // callBack={(change)=>{
        //     log("更新数据");
        //     log(change);
        //     for(let v in change){
        //         obj[v]= change[v];
        //     }
        //     log(obj);
        // }}
    }
    getChildrenView(obj){
        var view = null;

        if(obj.type=="input"){
            view =  <input
                className={css.right}
                placeholder={obj.placeholder?obj.placeholder:("请输入"+obj.title)}
                defaultValue={obj.value}
                onChange={(e)=>{
                    obj.value = e.target.value;
                    this.callBack();
                }}/>
        }else if(obj.type=="select"){
            view =  <div
                className={css.right}
                {...ClickHelp.onClick(()=>{
                    var open = ()=>{
                        SelectView.open((value,indexs,lastData)=>{
                            obj.selectValue = lastData.title;
                            if (obj.isSelectID){
                                obj.value = lastData.id;
                            }else {
                                obj.value = lastData.title;
                            }
                            this.callBack();
                            this.upView();
                        },obj.data)}
                    if(obj.data){
                        open();
                    }else if(obj.api){
                        this.loadMoreData((json)=>{
                            obj.data  = json;
                            open();
                        },(code,message)=>{
                            Toast.showToast(message);
                        });
                    }else{
                        Toast.showToast("无有效数据");
                    }
                })}
            >{this.getRightTitle(obj)}</div>
        }else if(obj.type=="time"){
            var nowD = new Date();
            if(obj.value){
                nowD.setTime((new Date(obj.value)).getTime())
            }
            view =  <div
                className={css.right}
                {...ClickHelp.onClick(()=>{
                    // this.selectDate(nowD,obj);
                    SelectDate.open((data,str) => {
                        var showStr = TimeHelp.getYMDFormat(data.getTime(),"yyyy/MM/dd")
                        obj.selectValue = showStr;
                        obj.value = showStr;
                        this.callBack();
                        this.upView();
                    },nowD,['YYYY', 'MM', 'DD'],obj.limitTime);
                })}>
                {this.getRightTitle(obj)}
            </div>
        }else if(obj.type=="diy"){
            view =  <div
                className={css.right}
                {...ClickHelp.onClick(()=>{
                    if(this.props.diyAction){
                        this.props.diyAction(obj,this.upView.bind(this));
                    }
                })}
            >{this.getRightTitle(obj)}</div>
        }else{
            view =  <div  className={css.right}>{obj.value}</div>
        }
        return view;
    }

    selectDate(nowD,obj){
        SelectDate.open((data,str) => {
            var showStr = TimeHelp.getYMDFormat(data.getTime(),"yyyy/MM/dd")
            obj.selectValue = showStr;
            obj.value = showStr;
            this.callBack();
            this.upView();
            if (new Date().getTime()<data.getTime()){
                nowD.setTime((new Date()).getTime());
                showStr = TimeHelp.getYMDFormat(new Date().getTime(),"yyyy/MM/dd");
                obj.selectValue = showStr;
                obj.value = showStr;
                this.selectDate(nowD,obj)
            }

        },nowD,['YYYY', 'MM', 'DD']);
    }

    getRightTitle(obj){
        var show = obj.selectValue;
        return (
            <span className={show?css.leftFont:css.rightFont}>{show?show:("请选择"+obj.title)}</span>
        );
}
    loadMoreData(callBack,errorBack){
        Loading.show(true);
        var successCallback = (code, message, json, option) => {
            Loading.show(false, () => {
                callBack(json);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false, () => {
                errorBack(code, message);
            });
        };
        HttpTool.post(this.obj.api, successCallback, failCallback, null);


    }
}
module.exports = RowItem;