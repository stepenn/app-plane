/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import  ScrollView from '../../component/ScrollDiv/ScrollDivCom.js';
import HelpI from '../../help/Help.js';
import HttpTool from '../../http/HttpTool.js';
/**
 * 演示网络请求的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    render() {

        var div = (
            <ScrollView
                style={{
                    background:"#fff000",
                    width:"100%",
                    height:"100%",
                }}
            >
                <div>
                    <div>这个页面用于演示请求网络</div>
                    <div
                    onClick={()=>{
                        HttpTool.post("/api/common/gitCityName", (code,message,json,option)=>{
                           alert(JSON.stringify(json));
                        },  (code,message,option)=>{
                            alert("错误 code:"+ code+"错误 message:"+ message);
                        },{

                        });
                    }}
                    >演示请求</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

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