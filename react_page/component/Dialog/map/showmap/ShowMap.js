/**
 * Created by lixifeng on 16/12/20.
 */
import React, {Component} from "react";
import css from "./ShowMap.css";
import HttpTool from "../../../../http/HttpTool.js";
import ScrollDivV from "../../../ScrollDiv/ScrollDivCom.js";
import Config from "../../../../Config.js";
import Toast from "../../../Toast/index.js";



class page extends Component {
    constructor(props) {
        super(props);
        this.selectIndex = 0;
        this.img_rightSelect = require('./../select.png');
        this.indexSelect =  0;
        this.state = {
            upData:0,
        }
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        });
    }

    //重写导航,搜索
    renderBar() {
        //0
        if(!this.img_back){
            this.img_back =require("./../barimg/back.png");
            this.img_clear =require("./../barimg/clear.png");
        }
        return (
            <div className={css.barBG}>
                <img className={css.barBGBack} onClick={() => {
                    this.back();
                }} src={this.img_back}/>
                <div ref={"search"} className={css.barBGInput}>
                    <div
                        onClick={()=>{
                            this.indexSelect = 0;
                            this.upView();
                            this.showLine();
                        }}
                        className={this.indexSelect==0?css.barActionLeftA:css.barActionLeft}>
                        公交
                    <div className={css.barActionLine}/>
                    </div>
                    <div
                        onClick={()=>{
                            this.indexSelect = 1;
                            this.upView();
                            this.showLine();
                        }}
                        className={this.indexSelect==1?css.barActionCenterA:css.barActionCenter}>
                        驾车
                        <div className={css.barActionLine}/>
                    </div>
                    <div
                        onClick={()=>{
                            this.indexSelect = 2;
                            this.upView();
                            this.showLine();
                        }}
                        className={this.indexSelect==2?css.barActionRightA:css.barActionRight}>
                        步行
                    </div>
                </div>
            </div>
        );
    }


    componentDidMount() {
        window.loadBaDuJScript(()=>{
            setTimeout(() => {
                //可以加载地图
                this.loadMap();
                // this.loadNet();
            }, 300)
        });
    }

    addDivChangeListen(){
        setTimeout(()=>{
            var string = this.refs["baiDuList"+this.indexSelect].innerHTML;
            var count = string.length;
            if(count>0){
                //添加了,进行删除
                var v = "到百度地图查看»";
                //搜索到了
                if(string.indexOf(v)>-1){
                    //存在,替换
                    string = string.replace(v,"");
                    this.refs["baiDuList"+this.indexSelect].innerHTML = string;
                    //删除加载中
                }
            }else{
                //继续搜索
                this.addDivChangeListen();
            }
           log(count);
        },10)
    }

    toCenter() {
        //得到中心点,进行计算
        var cp = this.map.getCenter();
        var bs = this.map.getBounds();   //获取可视区域
        this.query = null;
        this.lng =  cp.lng;
        this.lat = cp.lat;
        this.clear();
        this.loadMore();
    }


    loadMap() {
        //百度准备好.并页面准备好,并没有加载过,进行加载
        this.map = new BMap.Map(this.refs.baiDu);

        // //定位到当前位置
        // this.map.centerAndZoom(new BMap.Point(120, 30), 15);
        this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        this.map.addEventListener("moveend", () => {
            // this.toCenter();

        });
        //定位到当前城市
        this.toLocation();
    }
    showLine(){
        //等待加载完成baiDuList
        setTimeout(()=>{
            if(this.refs["baiDuList"+this.indexSelect]){
               this.showLineExe();
            }else{
             this.showLine();
            }
        },10)

    }
    showLineExe(){

        if(!this.startPoint){
            return;
        }
        var p1 = this.startPoint;
        var type = this.indexSelect;
        var p2 = new BMap.Point(this.props.option.lng,this.props.option.lat);
        //得到我的位置点
        var map = this.map;
        map.clearOverlays();
        // this.refs.baiDuList.innerHTML = "";
        var path = null;
        let option = {
            renderOptions: {
                map: map,
                autoViewport: true,
                panel:this.refs["baiDuList"+this.indexSelect],
            }
        };
        if(type==0){
            //公交
            path= new BMap.TransitRoute(map,option );
        }else
        if(type==1){
            //驾车
            path = new BMap.DrivingRoute(map, option);
        }else{
            // 步行
            path = new BMap.WalkingRoute(map,option);
        }
        path.search(p1, p2);
        this.addDivChangeListen();
    }

    //定位到当前城市
    toLocation() {

        var toLocation = ()=>{
            //定位到当前城市
            var myFun = (result)=>{
                this.cityName = result.name;
                this.map.setCenter(this.cityName);
                //添加我的位置
                this.startPoint = result.center;
                this.showLine();
            }
            var myCity = new BMap.LocalCity();
            myCity.get(myFun);
        }
        if(window.plus){

            plus.geolocation.getCurrentPosition(  ( p )=> {

                var pointA = new BMap.Point(p.coords.longitude,p.coords.latitude);  // 创建点坐标B--江北区
                this.map.setCenter(pointA);
                this.startPoint = pointA;
                this.showLine();
            },  ( e )=> {
                alert("APP中定失败");
                toLocation();
            } );
        }else{
            toLocation();
        }
    }
    render() {
        return (
            <div className={css.main}>
                {this.renderBar()}
                <div className={css.content}>
                    {this.rs()}
                </div>
            </div>
        );
    }
    rs() {
        return (
            <div className={css.main}>
                <div className={css.mainTop}>
                    <div ref="baiDu" className={css.baiDu}/>
                    <img
                        onClick={() => {
                            //反加当前的定位地址
                            this.showLine();
                            {/*this.toLocation();*/}
                        }}

                        className={css.baiDuLocation} src={require("./../icon_location.png")}/>
                </div>
                <ScrollDivV key={this.indexSelect}  className={css.bottomView}>
                    <div ref={"baiDuList"+this.indexSelect} className={css.bottomViewMain} />
                </ScrollDivV>
            </div>
        );
        // 百度地图API功能
    }


    loadData(callparms) {
        //参数
        // var  param = {
        //     pageNo:callparms.pageIndex,
        //     pageSize:20,
        // };

        var query = this.query;
        var lat = this.lat;
        var lng = this.lng;
        var param = {
            ak: Config.getBaiDuKey(),
            output: "json",
            page_size: 20,
            page_num: 1,
        };
        var url = null;

        if (query) {
            url = "http://api.map.baidu.com/place/v2/search";
            param.q = query;
            param.scope = 1;
            param.region = this.cityName ? this.cityName : "中国";

        } else {
            url = "    http://api.map.baidu.com/geocoder/v2/";
            param.location = lat + "," + lng;
            param.pois = "1";
        }
        var successCallback = (code, message, json, option) => {
            if (json && json.status == 0) {
                var dataS = [];
                if (query) {
                    if (json.results) {
                        var size = json.results.length;
                        for (var i = 0; i < size; i++) {
                            let d = json.results[i];
                            dataS.push({
                                name: d.name,
                                address: d.address,
                                lng: d.location.lng,
                                lat: d.location.lat,
                            })
                        }
                        //得到搜索结果,得到第一个的经纬度,进行位移
                        if (size > 0) {
                            this.map.centerAndZoom(new BMap.Point(dataS[0].lng, dataS[0].lat), 16);
                        }

                    }
                } else {
                    if (json.result) {
                        var size = json.result.pois.length;
                        for (var i = 0; i < size; i++) {
                            let d = json.result.pois[i];
                            dataS.push({
                                name: d.name,
                                address: d.addr,
                                lng: d.point.x,
                                lat: d.point.y,
                            })
                        }
                    }

                }
                callparms.success(dataS);
                callparms.finish(true);
            }
        };
        var failCallback = (code, message) => {
            Toast.showToast("code:" + code + "message:" + message, "red");
        };
        HttpTool.otherApi(url, "get", successCallback, failCallback, param);
    }

    back(){
        if(this.props.onCancel){
            this.props.onCancel();
        }
    }
}
module.exports = page;