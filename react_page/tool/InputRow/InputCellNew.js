/**
 * Created by lixifeng on 17/1/19.
 */
/**
 * Created by Administrator on 2016/11/3.
 */
import React, {Component} from 'react';
import Toast from '../../component/Toast/index';
import css from './InputCellNew.less';
import ClickHelp from '../../tool/ClickHelp.js';
class InputCellNew extends Component{
    constructor(props){
        super(props);
        // this.img_clear = require("./clear.png");
        this.img_clear = window.imgHost + '/images/icon_clear.png';
        this.timeDefaul = 60;

        if(this.props.getObject){
            this.props.getObject({getInputValue:this.getInputValue.bind(this),
                getValue:this.getValue.bind(this)})
        }
        this.img_label = window.imgHost + '/images/bg_label.png';
        this.img_input = window.imgHost + '/images/input_PW.png';
        this.state = {
            state:0,
            timeCount: this.timeDefaul,
            show:false,
            upData:0,
        }
    }
    upView(state){
        this.setState({
            state:state,
        })
    }
    upViewPage(){
        this.setState({
            upData:this.state.upData+1,
        })
    }
    clearAutoTime() {
        this.startTime = false;
        this.setState({
            timeCount: this.timeDefaul,
        })
    }
    //倒计时
    autoTime(first) {
        if (first) {
            this.startTime = true;
        }
        setTimeout(() => {
            if (this.state.timeCount <= 0) {
                this.clearAutoTime();
            } else {
                if (!this.startTime) {
                    return;
                }
                this.setState({
                    timeCount: this.state.timeCount - 1,
                })
                this.autoTime(false);
            }
        }, first ? 0 : 1000);
    }


    componentDidMount() {

        this.showInputValue(this.props);
    }

    // 6.componentWillReceiveProps
    // 组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。
    componentWillReceiveProps(nextProps) {
        this.showInputValue(nextProps);
    }
    componentWillUnmount(){
        this.clearAutoTime();
    }
    autoShowValue(value){
        setTimeout(()=>{
            var com = this.refs[("com")];
            if(com){
                if(com.value !=value){
                    com.value = value;
                    this.autoShowValue(value);
                }
            }else{
                this.autoShowValue(value);
            }


        },100)
    }
    showInputValue(props) {
        var data = props.data;
        if (!data) {
            data = {};
        }
        // this.refs[("com")].value = data.value ? data.value : "";
        // this.upViewPage();
        //更新显示
        if(data.valueOld){
            this.autoShowValue(data.valueOld);
        }else{
            this.autoShowValue(data.value ? data.value : "");
        }

    }
    render(){
        var {
            data,
        }=this.props;
        if(!data){
            data = {};
        }
        // var max = data.max>0?data.max:-1;
        // var max = 4;
        var viewSend = null;
        if(data.viewSend){
            //显示发送验证么
            let autoTimeExe = this.state.timeCount >= this.timeDefaul;
            var showValue = (this.state.timeCount <= 0 || autoTimeExe) ? "发送验证码" : ("已发送("+this.state.timeCount+")");
            viewSend = (
                <div className={autoTimeExe ? css.verBtn : css.verBtnNO} style={{
                        backgroundImage:`url(${this.img_label})`
                    }}
                     {...ClickHelp.onClick(()=>{
                        if (autoTimeExe) {
                            //验证手机号
                            if(data.sendCallBack){
                                data.sendCallBack(()=>{
                                    this.clearAutoTime();
                                },()=>{
                                    this.autoTime(true);
                                });
                            }


                        }
                })
                }
                >{showValue}</div>
            );
        }
        var cssInput = css.rowInputTitle;


        var fontStyle= {

        };
        if(data.noedit){
            if(data.color){
                fontStyle["color"]=data.color;
            }else{
                fontStyle["color"]="#666666";
            }

        }

        if(data.textAlign){
            fontStyle["textAlign"]=data.textAlign;
        }

        var click = data.onClick?{
            onClick: () => {
                data.onClick();
            }
        }:null;

        return (
            <div className={css.row} style={{
                backgroundImage:`url(${this.img_input})`
            }}>
                <div className={css.rowInputLayout}
                     {...click}
                     >
                    <input
                        ref={"com"}
                        placeholder={data.hint}
                        type={data.type}
                        disabled={data.noedit}
                        onBlur={()=>{
                            //验证是否合格
                            this.getValue(data);

                        }}
                        onFocus={()=>{
                            this.setState({
                                show:true,
                            })
                            this.scrollDiv();
                        }}
                        className={cssInput}
                        style={
                            fontStyle
                        }
                    />
                </div>

                <img
                    {...ClickHelp.onClick(()=>{
                        this.refs[("com")].value = "";
                    })}
                    className={(this.state.show&&!data.noedit&&!data.viewSend)?css.rowClear:css.rowClearH}
                    src={this.img_clear}/>
                {viewSend}
            </div>
        );
    }

    scrollDiv(){
        if(/Android [4-6]/.test(navigator.appVersion)) {
            window.addEventListener("resize", ()=> {
                if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
                    window.setTimeout(()=> {
                        document.activeElement.scrollIntoViewIfNeeded();
                    },0);
                }
            })
        }
    }

    getInputValue(){
       return this.refs["com"].value;
    }
    getValue(data){
        var value = "";
        if(this.refs[("com")]){
            value = this.refs["com"].value
        }

        data["value"] = value;
        if(data.reg){
            //提示为错误
            if(!value||value.length<1){
                this.upView(0);
                data.reg_state = false;

            }else{
                var v = data.reg.test(value);
                if(v){
                    //更新为错误
                    this.upView(0);
                }else{
                    this.upView(-1);
                    Toast.showToast(data.title+(data.regTitle?(":"+data.regTitle):""));
                }
                data.reg_state = v;
            }

        }else{
            data.reg_state = true;
        }

        //回调出去,已经确定的值
        if(this.props.callBack){
            this.props.callBack(data);
        }

        this.setState({
            show:value&&value.length>0,
        })
    }
}
module.exports = InputCellNew;