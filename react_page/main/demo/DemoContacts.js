/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../help/Help.js';
import ContactsHelp  from "../plus/ContactsHelp.js";
import ScrollView from '../../component/ScrollDiv/ScrollDivCom.js';
/**
 * 测试手机通讯列表的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state = {upData:0}
    }

    upView(){
        this.setState({
            upData : this.state.upData+1,
        });
    }



    getList(){

        ContactsHelp.getList((data)=>{
            alert(data.length);
            this.viewS = [];
            for(let i in data){
                var obj = data[i];
                this.viewS.push(
                    <div
                        key={i}
                        style={{fontSize:"0.5rem",color:"#ff00ff"}}
                    >
                        {"名字:"+obj.name+"手机号:"+JSON.stringify(obj.phones)}
                    </div>
                )
            }
            this.upView();
        },(e)=>{
            alert(JSON.stringify(e));
        })





    }
    render() {
        var div = (
            <ScrollView style={{width:"100%",height:"100%"}} >
                <div>
                    <div>这是获取通讯录页面</div>
                    <div>{"标题:"+this.Help.app_getParameter(this).title}</div>

                    <div style={{fontSize:"1rem"}} onClick={()=>{

                        this.getList();


                    }}>获取通讯列表</div>
                    {this.viewS}
                </div>


            </ScrollView>
        );
        return this.Help.app_render(this,div,{full:false});
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;