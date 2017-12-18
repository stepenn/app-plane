/**
 * Created by apin on 2017/5/24.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './AddPlanePer.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Toast from '../../../component/Toast/index.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import SelectView from "../../../component/Dialog/SelectView/index.js";
import AddPlanePerItem from './AddPlanePerItem';
import ClickHelp from '../../../tool/ClickHelp.js';

class page extends Component {
    constructor(props) {
        super(props);
        this.selectData = [{title:"身份证",id:1},{title:"护照",id:2},{title:"军人证",id:3},{title:"港澳通行证",id:4}];
        this.Help = new HelpI();

        this.myData = this.Help.app_getParameter(this).prarm;
        this.selectObj =this.myData?this.selectData[parseInt(this.myData.id_type)-1]:this.selectData[0];
        this.state = {
            upData:0,
        }
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.img_label = window.imgHost + '/images/bg_label.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }

    animEnter(){

    }

    render() {
        var div  = (<ScrollDivV className={css.main}>
            <div className={css.photoArea}
                 {...ClickHelp.onClick(()=>{
                     SelectView.open((value,indexs,lastData)=>{
                         this.selectObj = lastData;
                         this.dataS = null;
                         this.upView();
                     },this.selectData)
                 })}>
                <div className={css.phoneBtn} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_label)
                }}>{this.selectObj.title+" ▼"}</div>

            </div>
            <div key={this.selectObj.id}>
                {this.createView()}
            </div>
            <div className={css.submit} style={{
                backgroundImage: this.Help.getImgUrl(this.img_submit)
            }}
                 {...ClickHelp.onClick(()=>{
                     this.submit();
                 })}
            >确定</div>
        </ScrollDivV>);
        return this.Help.app_render(this,div);
    }
    submitTest(){
        this.Help.app_open(this,"SelectCity",{title:"选择城市"})
    }
    submit(){
        var param = {};
        for(let i in this.dataS){
            let obj =this.dataS[i];
            if(obj.name){
                param[obj.name] = obj.value;
                if(obj.must&&!obj.value){
                    if(obj.type=="select"){
                        Toast.showToast("请选择"+obj.title);
                    }else if(obj.type=="input"){
                        Toast.showToast("请输入"+obj.title);
                    }else{
                        Toast.showToast(obj.title+"不能为空!");
                    }
                    return;
                }
            }
        }
        //证件类型1:身份证;2:护照;3:军人证;4:港澳通行证;
        param.id_type=this.selectObj.id;
        if (this.myData){
            param.id=this.myData.id;
        }
        Loading.show(true);
        var successCallback = (code, message, json, option) => {
            Loading.show(false, () => {
                this.Help.setIntent(json);
                this.Help.back(this);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false, () => {
                Toast.showToast(message);
            });
        };
        HttpTool.post(this.myData?APIGYW.api_passenger_editPassenger:APIGYW.api_passenger_addPassenger, successCallback, failCallback, param);
    }

    getSelectDataForSFZ(type){
        var userName = {
            must:true,
            name:"passenger_name",
            title:"乘客姓名",
            type:"input",
            value:this.myData?this.myData.passenger_name:"",
        };
        var userType = {
            must:true,
            name:"type",
            title:"乘客类型",
            type:"select",
            isSelectID:true,
            data:[{title:"成人",id:1},{title:"儿童",id:2}],
            value:this.myData?this.myData.type:1,
            selectValue:this.myData?(this.myData.type==1?"成人":"儿童"):"成人",
        };
        var userSex = {
            must:true,
            name:"gender",
            title:"姓别",
            type:"select",
            isSelectID:true,
            data:[{title:"男",id:1},{title:"女",id:2}],
            value:this.myData?this.myData.gender:1,
            selectValue:this.myData?(this.myData.gender==1?"男":"女"):"男",
        };
        var userBr = {
            must:true,
            name:"birthday",
            title:"生日",
            type:"time",
            limitTime:{min:new Date(1900, 0, 1),max:new Date()},
            value:this.myData?this.myData.birthday:"",
            selectValue:this.myData?this.myData.birthday:"",
        };
        var dataS = [];

        if(type==1){
            dataS.push({
                must:true,
                name:"id_no",
                title:"身份证",
                type:"input",
                value:this.myData?this.myData.id_no:"",
            })
            dataS.push({type:"space"})
            dataS.push(userName)
            dataS.push(userType)


        }else if(type==2||type==4){
            dataS.push({
                must:true,
                name:"id_no",
                title:"证件号码",
                type:"input",
                value:this.myData?this.myData.id_no:"",
            })
            dataS.push({type:"space"})

            dataS.push({
                must:true,
                name:"passenger_name",
                title:"姓名",
                type:"input",
                placeholder:"拼音,如:zhang/san",
                value:this.myData?this.myData.passenger_name:"",
            })
            dataS.push(userType)
            dataS.push(userSex)
            dataS.push({type:"space"})
            dataS.push({
                must:true,
                name:"nation",
                title:"国籍",
                type:"select",
                isSelectID:false,
                value:this.myData?this.myData.nation:"",
                selectValue:this.myData?this.myData.nation:"",
                api:APIGYW.api_common_gitCountryList
            })
            dataS.push(userBr)
            dataS.push({type:"space"})
            dataS.push({
                must:true,
                name:"issue_place",
                title:"证件签发地",
                type:"select",
                isSelectID:false,
                value:this.myData?this.myData.issue_place:"",
                selectValue:this.myData?this.myData.issue_place:"",
                api:APIGYW.api_common_gitCountryList
            })
            dataS.push( {
                must:true,
                name:"expire_time",
                title:"证件有效期",
                type:"time",
                limitTime:{min:new Date()},
                value:this.myData?this.myData.expire_time:"",
                selectValue:this.myData?this.myData.expire_time:"",
            })
        }else {
            dataS.push({
                must:true,
                name:"id_no",
                title:"证件号码",
                type:"input",
                value:this.myData?this.myData.id_no:"",
            })
            dataS.push({type:"space"})
            dataS.push(userName)
            dataS.push(userType)
            dataS.push(userBr)
        }
        return dataS;

    }

    createView(){
        if(!this.dataS){
            this.dataS = this.getSelectDataForSFZ(this.selectObj.id);
        }
        var viewS = [];
        for(let i in this.dataS){
            let obj = this.dataS[i];
            if(obj.type=="space"){
                viewS.push(<div key={i} className={css.showLine}></div>)
            }else{
                viewS.push(<AddPlanePerItem
                    key={i}
                    obj={obj}
                    diyAction={(o,upView)=>{
                        //打开页面
                        this.Help.app_open(this, "SelectCity", {title: "选择城市",
                            callBack:(city)=>{
                                alert(JSON.stringify(city));
                                o.value = city.city_name;
                                o.selectValue = city.city_name;
                                upView();
                            }})
                    }}
                />)
            }
        }
        return viewS;
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;