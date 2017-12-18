/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './Message.css';
import Toast from '../../Toast/index.js';
import ClickHelp from '../../../tool/ClickHelp.js';
class Message extends Component{
    constructor(props) {
        super(props);
        this.state = {
            size:0,
        };
        this.img_dialog = window.imgHost + '/images/img_dialog.png';
    }

    render(){
        var {
            title,
            hint,
            value,
            max,
        } = this.props.option;
    if(!max){
        max = 999999999;
    }

        var hint_v = "我是...";
       var title_v ="添加好友";
       var value_v ="";
        if(hint){
            hint_v = hint;
        }
        if(title){
            title_v = title;
        }
        if(value){
            value_v = value;
        }

        return(
            <div className={css.bg}
                 onClick={()=>{
                     this.close();
                 }}
            >
                <div className={css.main} style={{
                        backgroundImage: `url(${this.img_dialog})`
                    }} onClick={(e)=>{
                             ClickHelp.stopClick(e);
                         }}
                    >
                        <div className={css.top}> {title_v}</div>
                        <div className={css.text}>
                            <input autoFocus ref={"dom"}  className={css.content} defaultValue={value_v}  type="text" placeholder={hint_v}
                            onChange={(event)=>{
                               var v= event.target.value;
                             this.verLen(v,max,1);
                            }}
                            />
                            {/*<div className={css.tip}>你还可输入{max-this.state.size}字</div>*/}
                        </div>
                          <div className={css.bottom}>
                              <div className={css.button}
                                   {...ClickHelp.onClick(()=>{
                                       this.close();
                                   })}
                              >取消</div>
                              <div className={css.button_1}
                                   {...ClickHelp.onClick(()=>{
                                       if(this.props.callBack){
                                           var v = this.refs.dom.value;
                                           if(this.verLen(v,max,0)){
                                               return;
                                           };
                                           this.props.callBack(v);
                                       }
                                       this.close();
                                   })}
                              >确定</div>
                          </div>
                    </div>
            </div>

        )
    }

    componentDidMount(){
        // this.verLen(this.refs.dom.value,this.props.option.max,0);
        var {
            value,
        } = this.props.option;
        var value_v ="";
        if(value){
            value_v = value;
        }
        this.verLen(this.refs.dom.value,this.props.option.max,0);
        this.refs.dom.innerText="";
        this.refs.dom.focus();
        this.refs.dom.innerText=value_v;
    }
    verLen(v,max,diff){
        var size = (v)?v.length:0;

        this.setState({
            size:size,
        });
        if(v&&v.length>max){
            Toast.showToast("你已经超出"+(this.state.size-max+diff)+"字","black");
            return true;
        }
        return false;
    }
    close(){
        if(this.props.onCancel){
            this.props.onCancel();
        }
    }
}
module.exports = Message;