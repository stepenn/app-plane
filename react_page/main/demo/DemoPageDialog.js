/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import Toast from '../../component/Toast/index.js';
import Input from '../../component/Dialog/Input/index.js';
import  Loading from '../../component/Dialog/Loading/index';
import Select from '../../component/Dialog/Select/index.js';
import  ScrollView from '../../component/ScrollDiv/ScrollDivCom.js';
import HelpI from '../../help/Help.js';
/**
 * 演示各种弹窗的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    render() {
        var style = {
            background:"#bcd8ff",
            padding:"10px",
            margin:"10px",
            boxSizing: "border-box"
        }
        var div = (
            <ScrollView
                style={{
                    background:"#fff000",
                    width:"100%",
                    height:"100%",
                }}
            >
                <div>
                    <div>这个页面用于显示各种弹窗的操作</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>


                    <div style={style}
                    onClick={()=>{
                        Toast.showToast("你好啊")
                    }}
                    >Toast提示</div>

                    <div style={style}
                         onClick={()=>{
                             Toast.showToast("你好啊","#ff00ff","#ffffff")
                         }}
                    >Toast提示修改样式</div>

                    <div style={style}
                         onClick={()=>{

                             Input.open((v)=>{
                               alert(v);
                             },{max:100});

                         }}
                    >弹出输入框</div>
                    <div style={style}
                         onClick={()=>{

                             Loading.show(true);
                             setTimeout(()=>{
                                 Loading.show(false,()=>{
                                     Toast.showToast("加载框消失","#ff0000","#ffffff")
                                 });
                             },2000);
                         }}
                    >弹出加载(2秒后消失)</div>
                    <div style={style}
                         onClick={()=>{
                             Select.open((yes)=>{
                                 this.selectYes = yes;
                             },{
                                 title:"请选择",
                                 content:"是否去死",
                             },()=>{
                                 //关闭之后
                                 if(this.selectYes){
                                     //关闭页面,并打开浏览器
                                     Toast.showToast("我死了","#ff0000","#ffffff")
                                 }else{
                                     //继续扫描
                                     Toast.showToast("我还想活着","green","#ffffff")
                                 }
                             });
                         }}
                    >弹出选择</div>
                </div>
            </ScrollView>
        );
        return this.Help.app_render(this,div);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;