/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
import ScrollView from '../../component/ScrollDiv/ScrollDivCom.js';
import InputCellNew from '../../tool/InputRow/InputCellNew.js';
var Help = new HelpI();
/**
 * 带导航的页面
 */

window.onresize = function(){

    alert("压缩了");


}

class page extends Component {

    componentDidMount() {

       var body = document.body;
       alert(body.height);
       alert(body.clientHeight);
        body.height = document.body.clientHeight;
    }
    getShowData() {
        var dataS = [];
        dataS.push({
            name: "mobile",
            title: "用户名",
            hint: "请输入手机号",
            type: "number",
            reg: /^[\S]{2,11}$/,
            regTitle: "11位数字",
        });
        dataS.push({
            name: "password",
            title: "密码",
            hint: "请输入您的密码",
            type: "password",
            reg: /^[\S]{8,16}$/,
            regTitle: "8—16位的字母数字组合(不支持特殊字符)",
        });
        return dataS;
    }
    getShowRow(data,i){
        return (
            <InputCellNew ref={i} data={data} key={"input"+i}
            />
        );
    }
    getShowView(){
        if(this.showViewTypeLeft){
            return this.showViewTypeLeft;
        }

        if(!this.dataS){
            this.dataS = this.getShowData();
        }

        let size = this.dataS.length;
        var viewS = [];
        for(var i=0;i<size;i++){
            viewS.push(this.getShowRow(this.dataS[i],i));
        }
        return this.showViewTypeLeft  = viewS;
    }

    render() {
        var div = (
            <ScrollView style={{backgroundColor:"#ff0000",width:"100%",height:"100%"}}>
                <div>
                    <div>这是一个测试输入键盘的页面</div>

                    {this.getShowView()}
                    <input default="第一个输入框"/>
                    <div onTouchStart={()=>{
                        document.activeElement.blur();
                    }}
                        style={{
                            color:"#ff2fc3",
                            fontSize:"25px",
                        }}
                    >点我吧,皮卡丘</div>



                    <div style={{position:"absolute",bottom:0}}>
                    <input default="第二个输入框"
                           onFocus={()=>{
                               {/*alert(document.body.clientHeight)*/}
                               window.onresize = ()=>{
                                   alert(3)
                               }
                               window.addEventListener("resize", ()=> {
                                   alert(2)
                                   if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
                                       window.setTimeout(()=> {
                                           document.activeElement.scrollIntoViewIfNeeded();
                                       },0);
                                   }
                               })
                           }}
                    />
                    <div onTouchStart={()=>{
                        document.activeElement.blur();
                    }}
                         style={{
                             color:"#ff2fc3",
                             fontSize:"25px",
                         }}
                    >点我吧,皮卡丘2</div></div>
                </div>
            </ScrollView>
        );
        return div;
    }
}


page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;