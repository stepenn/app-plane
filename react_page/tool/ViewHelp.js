/**
 *
 * Created by lixifeng on 16/12/12.
 */
import  React from 'react';
import CellViewForRow from '../tool/CellViewForRow/index';
import Toast from '../component/Toast/index.js';
import TimeHelp from '../tool/TimeHelp.js';
import CDict2 from  './CellViewForRow/data/CDict2.js';

module.exports = {
    /**
     * 数据示例
     *
     */
    getMapObj(){
        var data = [
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"姓名",//左边标题
                viewtype:1,//显示为显示 ,不可编辑项
                value:"李先生",//对应名字
            },
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"标题",//左边标题
                viewtype:2,//显示为输入类型
                value:"今天有太阳",//对应 显示默认值,不存在,此无
                notEmpty:true,//必选 false:可不选
            },
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"性别",//左边标题
                viewtype:3,//显示为滑动选择
                value:"男",//对应的默认值
                valueSelect:1,//默认值下标
                selectData:[
                    {
                        id:1,
                        title:"男"
                    }, {
                        id:2,
                        title:"女"
                    }
                ],
                notEmpty:true,//必选 false:可不选

            },
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"所在地区",//左边标题
                viewtype:33,//显示为滑动选择
                value:"男",//对应的默认值
                valueSelect:1,//默认值下标
                api_method:"getData",//网络拉取数据
                notEmpty:true,//必选 false:可不选
            },
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"职位要求",//左边标题
                viewtype:33,//显示为滑动选择
                value:"XXX",//对应的默认值
                valueSelect:1,//默认值下标
                notEmpty:true,//必选 false:可不选
                selectData:this.getSelectDataForJS()
            },
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"出生日期",//左边标题
                viewtype:4,//显示为选择时间
                valueTime:"1400000000000",//lnt,lat
                notEmpty:true,//必选 false:可不选
            },
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"地区",//左边标题
                viewtype:44,//显示为搜索单位事项(网上办事专用)
                value:"显示值",//对应显示
                notEmpty:true,//必选 false:可不选

            },
            {
                name:"提交KEY",//提交数据的KEY 如 aa001
                title:"地区",//左边标题
                viewtype:7,//显示为选择地图
                value:"杭州市人力资源和社会保障信息中心",//对应名字
                location:"120.189317,30.262242",//lnt,lat
                notEmpty:true,//必选 false:可不选

            }
        ];
    },


    /**
     *
     * @param datas 显示数据源
     * @param hiddenDatas 要隐藏,不显示的数据源
     * @param showKey 显示区分KEY
     * @returns {Array} 返回视图数组
     */
    getRowView(datas,hiddenData,showKey){

        log("uuget")
        datas.sort((a,b)=>{
            if(!a.order){
                a.order = 999;
            }
            if(!b.order){
                b.order = 999;
            }
            return a.order-b.order});
        //显示排序

        var hiddenObj = this.arrayToObject(hiddenData);

        //注入存在
        var viewArray = [];
        //得到返回值
        var size_dom = datas.length;

        for(var i=0;i<size_dom;i++){
            //键值映射数据

            let dataValue = datas[i];

            //如果显示标识不存在,不显示
            if("ALLVIEW"!=showKey){
                if(!dataValue.CR_showKey){
                    continue;
                }
                if(dataValue.CR_showKey!=showKey){
                    continue;
                }
            }

            //如果值要隐藏,不显示
            if(hiddenObj[dataValue.name]){
                //不显示的类型.提交数据的时候.不判断
                dataValue.viewtype = 1;
                continue;
            }

            //注入类型默认值
            if(dataValue.viewtype==2){
                if(!dataValue.value||dataValue.value == ""){
                    dataValue.value = "";
                    //11
                }
                dataValue.CR_inputValue = dataValue.value;
            }else if(dataValue.viewtype==3){
                if(!dataValue.valueSelect){
                    dataValue.value = null;
                }
                dataValue.CR_selectIndex = dataValue.valueSelect;
                //选择类型数据源
                dataValue.CR_selectData = this.getSelectData(dataValue.selectData)
            }else if(dataValue.viewtype==33){
                //多级选
                //默认为单级,标识下载
                // if(!dataValue.valueSelect){
                //     dataValue.value = null;
                // }
                dataValue.viewtype = 3;
                dataValue.CR_selectIndex = dataValue.valueSelect;
                dataValue.CR_api = dataValue.api_method;
            }else if(dataValue.viewtype==301){
                dataValue.viewtype = 3;
                if(!dataValue.valueSelect){
                    dataValue.value = null;
                }
                dataValue.CR_selectIndex = dataValue.valueSelect;

                var selectData = {
                    id:dataValue.CR_selectIndex,
                };
                //回归显示值
                //选择类型数据源
                dataValue.CR_selectData = this.getSelectDataForJS(null,selectData);
                dataValue.value = selectData.title;

            }
            else if(dataValue.viewtype==4){
                if(dataValue.valueTime){
                    //格式化时间显示
                    dataValue.value = TimeHelp.getYMDFormat(dataValue.valueTime,"yyyy年MM月dd日");
                    dataValue.CR_selectTime =TimeHelp.getYMDFormat(dataValue.valueTime,"yyyy-MM-dd");
                }else{
                    dataValue.CR_selectTime = null;
                    dataValue.value = null;
                }
            }else if(dataValue.viewtype==7){
                //地图选择
                if(!dataValue.value||dataValue.value == ""){
                    dataValue.value = "";
                    //11
                }
                dataValue.CR_selectMapValue = dataValue.location;

            }else{
                // 1:显示值,不处理 5:图片,不处理
                if(!dataValue.value||dataValue.value == ""){
                    dataValue.value = "";
                }
            }
            //注入选择类型
            //添加显示源

            var star = false;
            if (typeof(dataValue.notEmpty) == "undefined") {
                //不存在默认为false
                // star = dataValue.viewtype==2||dataValue.viewtype==3||dataValue.viewtype ==4 ||dataValue.viewtype==5;
                star = false;
                dataValue.notEmpty = false;//添加为可不填写
                dataValue.CR_must = false;//添加为为,可不填写
            }else{
                dataValue.CR_must = dataValue.notEmpty;
                star = dataValue.CR_must;
            }
            var defaultTime = new Date();
            if(dataValue.valueTime){
                defaultTime.setTime(dataValue.valueTime);
            }
            viewArray.push(<CellViewForRow key={i} data = {{
                title:dataValue.title,
                type:dataValue.viewtype,
                api:dataValue.CR_api,
                value:dataValue.value,
                inputType:dataValue.inputType,
                inputMax:dataValue.inputMax,
                inputMin:dataValue.inputMin,
                dateFormat:['YYYY年', 'MM月', 'DD日'],
                defaultTime:defaultTime,
                star:star,
                name:dataValue.name,
                selectData:dataValue.CR_selectData,
                selectCallBack:(value,indexs,lastData)=>{
                    log(value);
                    log(lastData);
                    dataValue.CR_selectIndex = lastData.id;
                    dataValue.valueSelect = lastData.id;
                    if(dataValue.selectRule=="name"){
                        dataValue.value = value;
                    }else{
                        dataValue.value = lastData.title;
                    }

                },
                selectTimeCallBack:(date,str)=>{
                    log(date);
                    log(str);
                    dataValue.CR_selectTime = TimeHelp.getYMDFormat(date.getTime(),"yyyy-MM-dd");
                    log(dataValue.CR_selectTime);
                    dataValue.valueTime = date.getTime();

                },
                inputCallBack:(value)=>{
                    log(value);
                    dataValue.CR_inputValue = value;
                    dataValue.value = value;

                },
                imgCallBack:(state,path)=>{
                    //得到选择的图片
                    log(path);
                    dataValue.CR_selectPath = path;
                },
                selectSearchCallBack:(data,str)=>{
                    //得到选择的图片
                    log(data);
                    dataValue.CR_selectSearchValue = str;
                    dataValue.value = str;
                },
                selectMapCallBack:(data)=>{
                    //得到选择的地图
                    log(data);
                    dataValue.CR_selectMapValue = data.lng+","+data.lat;
                    dataValue.value = data.name;
                }

            }}/>);
        }
        return viewArray;
    },
    getRowViewAll(datas){
        return this.getRowView(datas,null,"ALLVIEW");
    },
    getPostValue(listData,hiddenData,postValue,showToast){
        this.getPostValue(listData,hiddenData,postValue,showToast,null);
    },
    getPostValue(listData,hiddenData,postValue,showToast,option){
        var success = true;
        if(!postValue){
            postValue = {};
        }
        if(!listData){
            listData = [];
        }

        var hiddenObj = this.arrayToObject(hiddenData);
        var size_list = listData.length;
        for(var i=0;i<size_list;i++){
            let data = listData[i];
             var CR_must = false;
            if (typeof(data.CR_must) == "undefined") {
                //未知,以必选处理
                CR_must = true;
            }else{
                CR_must = data.CR_must;
            }

            var add_value = "";
            var add_name = "";

            if(hiddenObj[data.name]){
                data.viewtype = 1;
            }
            if(data.viewtype==2) {
                add_value = data.CR_inputValue;
                add_name = data.name;
            } else if(data.viewtype==3) {

                    if(data.CR_selectIndex){
                        //选择了,以index优化
                        var v = option&&option.selectRule?option.selectRule:null;

                        if(data.selectRule){
                            v = data.selectRule;
                        }

                        if(v=="name") {
                            add_value = data.value;
                        }else if(v=="idname") {
                            add_value = data.CR_selectIndex + "_" + data.value;
                        }else{
                            add_value = data.CR_selectIndex;
                        }
                    }else if(data.value){
                        add_value = data.value;
                    }else{
                        add_value = null;//不存在值
                    }


                add_name = data.name;
            }
            else if(data.viewtype==4) {
                add_value = data.CR_selectTime;
                add_name = data.name;

            }else if(data.viewtype==5){
                //选择图片 组装数据
                add_value = null;
                add_name = "v_"+i;
                let url = data.CR_selectPath;
            }else if(data.viewtype==7){
                add_value = data.CR_selectMapValue;
                add_name = data.name;
            }else{
                //其它值
                add_value = data.value;
                add_name = data.name;

            }
            postValue[add_name] = add_value;
                //如果值要隐藏,不显示
            if(hiddenObj[add_name]){

                continue;
            }
            if(!CR_must){
                //非必选/不验证
                continue;
            }

            if(data.viewtype==2){
                if(!add_value||add_value==""){
                    //仅提示一次
                    if(success&&showToast){
                        Toast.showToast("请输入"+data.title,"black");
                    }
                    success = false;
                }
            }else if(data.viewtype==3){
                if(!add_value||add_value==""){
                    //仅提示一次
                    if(success&&showToast){
                        Toast.showToast("请选择"+data.title,"black");
                    }
                    success = false;
                }
            }else if(data.viewtype==4){
                if(!add_value||add_value==""){
                    //仅提示一次
                    if(success&&showToast){
                        Toast.showToast("请选择"+data.title,"black");
                    }
                    success = false;
                }
            }else if(data.viewtype==5){
                //选择图片 组装数据
                let url = data.CR_selectPath;
                if(!url){
                    if(success&&showToast){
                        Toast.showToast("请选择"+data.bizTitle,"black");
                    }
                    success = false;
                }else{
                    postValue[add_name] = {
                        "uuid":data.uuid,
                        "url": this.getUrl(url),
                    };
                }
            }else if(data.viewtype==4){
                if(!add_value||add_value==""){
                    //仅提示一次
                    if(success&&showToast){
                        Toast.showToast("请选择"+data.title,"black");
                    }
                    success = false;
                }
            }else{

            }
        }
        log("=======列表值Start");
        log(postValue);
        log("=======列表值End");
        return success;
    },
    getSelectData(datas){
        var selects = [];
        if(!datas){
            return null;
        }
        let size = datas.length;
        for(var i=0;i<size;i++){
            let data = datas[i];
            if(data.title){
                selects.push(data);
            }else{
                selects.push({
                    id:data.aaa102,
                    title:data.aaa103,
                })
            }

        }
        return selects;
    },
    arrayToObject(hiddenData){
        var obj = {};
        if(!hiddenData){
            return obj;
        }
        let size = hiddenData.length;
        for(var i=0;i<size;i++){
            obj[hiddenData[i]] = true;
        }
        return obj;
    },
    //拼接URL
    getUrl(data){
        var url = "";
        var size = data.length;
        for(var i=0;i<size;i++){
            url=url+(data[i]+((i+1==size)?"":","));
        }
        return url;
    },
    /**
     * 得到本地JS的显示方案
     * first 是否是首项
     */
    getSelectDataForJS(first,selectData){

        if(!selectData){
            selectData = {
                id:-1,
            };
        }
        var data = CDict2.arr_field;
        if(!data)return;
        let size = data.length;
        if(size<1)return;
        var dataS = [];
        for(var i=0;i<size;i++){
            let d = data[i];
            //d 中包含两个数据["2100", "电子信息类"],
            //判断,是否是最后两位00,

            let end = d[0].substring(d[0].length-2,d[0].length);
            let start = d[0].substring(0,d[0].length-2);
            let dI = {
                id:d[0],
                title:d[1],
            };
            if(selectData.id==dI.id){
                selectData["title"] = dI.title;
            }
            if(!first&&"00"==end){
                //搜索子项
                dI.data = this.getSelectDataForJS(start,selectData);
                dataS.push(dI);
            }else {
                //搜索子项目
                if(first==start){
                    dataS.push(dI);
                }
                //判断,是否是first开始

            }
            //如果是00 顶级,搜索21开头的其它项目,为当前子项
        }
        return dataS;
    }

};