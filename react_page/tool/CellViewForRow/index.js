/**
 * Created by lixifeng on 16/12/13.
 */

import React, {Component} from 'react';
import css from './index.css';

import ShowDetail from '../../component/Dialog/ShowDetail/index.js';
import DialogInput from '../../component/Dialog/Input/index.js';
import SelectView from '../../component/Dialog/SelectView/index';
import SelectDate from '../../component/Dialog/SelectDate/index';
import Map from '../../component/Dialog/map/getlocation/index';
import Loading from '../../component/Dialog/Loading/index.js';
import Toast from '../../component/Toast/index.js';
import HttpTool from '../../http/HttpTool.js';
import ShareHelp from '../../tool/ShareHelp.js';
import ImageHelp from '../ImageHelp.js';
class index extends Component {

    constructor(props){
        super(props);
        this.data = this.props.data;
        if(!this.data){
            this.data = {};
        }
        if(!this.data.type){
            this.data.type = 1;
        }

        // this.data  = this.getData();
        this.state = {
          upData:0,
        };
    }

    componentDidMount(){
        if(this.data&&this.data.type==5){
            ImageHelp.initImage();
        }

    }
    upShow(){
        this.setState({
            upData:this.state.upData+1,
        });
    }

    // type 1:显示文本,点击预览
    // type 2:可输入0文本,点击打开输入
    // type 3:下拉选择,点击打开开下拉 (单选/联动)
    // type 32:下拉选择,点击打开开下拉 (单选/联动 请求接口)
    // type 4:时间选择,点击打开时间选择
    // type 5:图片选择,点击选择图片
    // type 6:时间区间选择,点击分别选择
    // type 7:选择地点(地图,返回经纬度)
    // type 44:打开搜索选择 请求接口



    /**
     *
     * @returns {XML}
     */
    render() {

        // var {
        //     data,
        // } = this.props;
        var starView = this.data.star?<img className={css.star} src={require("./star.png")}/>:null;
        return (
            <div className={css.main}>
                <div className={css.rowTop}>
                    <div className={css.rowTopItemTitle}>{starView}{this.data.title}</div>
                    <div className={css.rowTopItem}>
                        {this.getTypeView(this.data)}
                    </div>
                </div>
                <div className={css.rowBottom}>
                    {this.getTypeViewLib(this.data)}
                </div>
                <div className={css.line}></div>
            </div>
        );
    }

    getTypeViewLib(data){
        if(data.type==5&&data.imgPaths){
            //显示图片

            var size =   data.imgPaths.length;

            var imgView = [];

            var width= window.screen.width;
            let col = 3;
            let space = 5;

            let imgW = (width-(col+1)*space)/col;

            for(var i=0;i<size;i++){
                var style = {
                    position: "relative",
                    width:imgW+"px",
                    height:imgW+"px",
                    marginTop:space+"px",
                    marginLeft:space+"px",
                    float:"left",
                    backgroundSize: "cover",
                }
                let index = i;

                // http://192.3.3.81:3333/uploadfiles/20161224/d7b18320c98f11e6a5b32ff5e781fe31.jpeg
            // http://192.3.3.81:3333/image.jpg?p=20161224/d7b18320c98f11e6a5b32ff5e781fe31.jpeg&w=300&h=200&q=50
                //组装显示小图
                var url = data.imgPaths[index];

                if(url.indexOf("/uploadfiles/")>0){
                    url = window.location.origin+"/image.jpg?p="+
                        url.split("/uploadfiles/")[1]+"&w="+window.screen.width+"&q=50";
                }

                style.backgroundImage="url("+url+")";
                imgView.push(
                    <div style={style} key={"key"+i}>
                        <img className={css.close} src={require("./close.png")}
                             onClick={()=>{
                                 this.remove(data.imgPaths,index);
                                 this.upShow();
                             }}
                        />
                    </div>
                )
            }
            return <div>
                {imgView}
                <div className={css.clear}></div>
            </div>;

        }else{
            return null;
        }
    }

    getRightIcon(value){
        return  <img className={css.triangle} src={value?require("./right_b.png"):require("./right_g.png")}/>
    }
    getOpenTemp(data,defaultValue){
        var value = data.value;
        return (
            <div className={css.sign}  onClick={()=>{this.click(data)}} >
                <div className={css.icon}>
                    {this.getRightIcon(value)}
                    <div className={value?css.sign_value2:css.sign_value2Default}>
                        {value?value:defaultValue}
                    </div>
                </div>
            </div>
        )
    }
    getTypeView(data){
        if(data.type==1){
            // type 1:显示文本,点击预览
            return <div className={css.sign_value1}  onClick={()=>{this.click(data)}}>{data.value}</div>
        }else if(data.type==2){
            // type 2:可输入0文本,点击打开输入
            return this.getOpenTemp(data,"输入"+data.title);
        }else if(data.type==3){
            // type 3:下拉选择,点击打开开下拉 (单选/联动)
            return this.getOpenTemp(data,"选择"+data.title);
        }else if(data.type==4){
            // type 4:时间选择,点击打开时间选择
            return this.getOpenTemp(data,"选择"+data.title);
        }else if(data.type==5){
            // type 5:图片选择,点击选择图片
            return (
                <div className={css.sign} onClick={()=>{this.click(data)}} >
                    <div className={css.sign_value5}>上传图片</div>
                </div>
            )
        }else if(data.type==44){
            return this.getOpenTemp(data,"去搜索"+data.title);
        }else if(data.type==7){
            return this.getOpenTemp(data,"选择"+data.title);
        }
        else{
            //其它
            return <div onClick={()=>{this.click(data)}}>{data.value}</div>
        }
    }

    click(data){
        if(data.type==1){
            //打开预览
            ShowDetail.open({
                title:data.title,
                value: data.value,
            });
        }else if(data.type==2){
            //打开输入
            DialogInput.open((value)=>{
                data.value = value;
                if(data.inputCallBack){
                    data.inputCallBack(value);
                }

                this.upShow();
            },{
                title:data.title,
                hint:"请输入"+data.title,
                value: data.value,
                type:data.inputType?data.inputType:"text",
                max:data.inputMax?data.inputMax:512,
                min:data.inputMin?data.inputMin:-1,
            });
        }else if(data.type==3){


            var exeSelect = ()=>{
                //打开下拉
                if(!data.selectData){
                    Toast.showToast("没有可选项","black");
                    return;
                }
                SelectView.open((value,indexs,lastData)=>{
                    data.value = lastData.title;
                    data.selectIndex = lastData.id;
                    if(data.selectCallBack){
                        data.selectCallBack(value,indexs,lastData);
                    }
                    this.upShow();
                },data.selectData);
            };

            //下载数据源
            if(data.api){
                this.loadNetSelectData(data.api,(json)=>{
                    data.selectData = json;
                    exeSelect();
                })
            }else{
                exeSelect();
            }

        }else if(data.type==4){
            //打开时间
            SelectDate.open((date,str)=>{
                data.value = str;
                if(data.selectTimeCallBack){
                    data.selectTimeCallBack(date,str);
                }
                this.upShow();
            },data.defaultTime,data.dateFormat);
        }else if(data.type==5){
            //打开上传图片
            //判断是否可以上传
            if(data.image_max&&data.imgPaths&&data.imgPaths.length>=data.image_max){
                Toast.showToast("最多选择!"+data.image_max+"张","black")
                return;
            }
            ImageHelp.getImgPath((state,paths)=>{
                if(state){
                    // 显示图片
                    if(data.imgPaths){
                        data.imgPaths =  data.imgPaths.concat(paths)
                    }else{
                        data.imgPaths = paths;
                    }
                    if(data.imgCallBack){
                        data.imgCallBack(state, data.imgPaths);
                    }
                    this.upShow();
                }else{
                    //提示错误
                    Toast.showToast("选择图片失败，请重新选择!","black")
                }
            })


        }else if(data.type==7){
            //打开地图
            Map.open((d)=>{
                data.value = d.name;
                if(data.selectMapCallBack){
                    data.selectMapCallBack(d);
                }
                this.upShow();
            },{api:data.api});
        }

    }

//请求下拉数据
    loadNetSelectData(api,callBack){
        if(!ShareHelp.selectData){
            ShareHelp.selectData = {};
        }
        log(api);
        log(ShareHelp.selectData[api]);
        if(ShareHelp.selectData[api]){
            callBack(ShareHelp.selectData[api]);
            return;
        }
        // Loading.addLoading(this.refs.loading);
        Loading.show(true);


        // http://192.3.3.178/zszp?domain=zswssb&method=getAa12Tree&openid=xxx&pid=110200000000
        var param={
            method:api,
            // aab003:"00",
            // method:"getAa12Tree",
            // pid:"110200000000",
        };

        var successCallback = (code, message, json)=> {
            Loading.show(false,()=>{
                //处理重复性字符串开始数据
                this.getClearData(json,null);
                callBack(json);
                ShareHelp.selectData[api] = json;
            });

        };
        var failCallback = (code, message,option)=> {
            Loading.show(false);
            Toast.showToast(message,"black");
        };
        HttpTool.post( HttpTool.APILXF.api, successCallback, failCallback,param);

    }
    getClearData(dataS,before){
        //

        if(dataS&&dataS.length>0){
            let size = dataS.length;
            for(var i=0;i<size;i++){
                let data = dataS[i];
                if(data.title&&before){
                    var fdStart = data.title.indexOf(before);
                    //判断元素是否存在 ,存在清除/
                    if(fdStart == 0){
                        // 去除
                        data.title=  data.title.substring(before.length,data.title.length)
                    }else if(fdStart == -1) {
                        // 不处理
                    }
                }
                this.getClearData(data.data,data.title);
            }

        }
    }
    getData(){
        return {
            star:true,
            title:"真实姓名",
            type:5,
            value:"请选择",
            defaultTime:new Date(),
            dateFormat:['YYYY年', 'MM月', 'DD日',"hh时","mm分"],
            selectData:this.getSelectArray1("项目"),

        };
    }

    remove(arr, dx) {
        if (isNaN(dx) || dx > arr.length) {
            return false;
        }
        for (var i = 0, n = 0; i < arr.length; i++) {
            if (arr[i] != arr[dx]) {
                arr[n++] = arr[i]
            }
        }
        arr.length -= 1
    }

    getSelectArray1(title){
        var size = 10;
        var data = [];
        for(var i=0;i<size;i++){
            var v = title+"_"+i;
            var d =  {title:v,}
            data.push(d)
        }

        return data;
    }
    getSelectArray2(title){
        var size = 10;
        var data = [];
        for(var i=0;i<size;i++){
            var v = title+"_"+i;
            var d =  {title:v,}
            d.data = this.getSelectArray1(v);
            data.push(d)
        }

        return data;
    }
    getSelectArray3(title){
        var size = 10;
        var data = [];
        for(var i=0;i<size;i++){
            var v = title+"_"+i;
            var d =  {title:v,}
            d.data = this.getSelectArray2(v);
            data.push(d)
        }

        return data;
    }

}
module.exports = index;