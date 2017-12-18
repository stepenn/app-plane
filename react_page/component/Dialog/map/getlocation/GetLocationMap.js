/**
 * Created by lixifeng on 16/12/20.
 */
import React, {Component} from 'react';
import css from './GetLocationMap.css';
import HttpTool from '../../../../http/HttpTool.js';
import ListView from '../../../ListView/ListView.js';
import Config from '../../../../Config.js';
import Toast from '../../../Toast/index.js';


class page extends Component {
    constructor(props) {
        super(props);
        this.selectIndex = 0;
        this.img_rightSelect = require('./../select.png');


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
                <input ref={"search"} className={css.barBGInput} placeholder={
                    "搜地点"
                }/>
                <img
                    onClick={()=>{
                        this.refs.search.value = "";
                    }}
                    className={css.barBGClear} src={this.img_clear}/>
                <div className={css.barBGSearch}
                     onClick={() => {
                         if (this.refs.search.value.length < 1) {
                             Toast.showToast("请输入搜索内容");
                             return;
                         }
                         this.query = this.refs.search.value;
                         this.clear();
                         this.loadMore();
                     }}>搜索
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
        this.map.centerAndZoom(new BMap.Point(0, 0), 15);
        this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        this.map.addEventListener("moveend", () => {
            this.toCenter();
        });
        //定位到当前城市
        this.toLocation();
    }

    //定位到当前城市
    toLocation() {
        var toLocation = ()=>{
            //定位到当前城市
            var myFun = (result)=>{
                this.cityName = result.name;
                this.map.setCenter(result.center);
            }
            var myCity = new BMap.LocalCity();
            myCity.get(myFun);
        }
        if(window.plus){
            plus.geolocation.getCurrentPosition(  ( p )=> {
                var pointA = new BMap.Point(p.coords.longitude,p.coords.latitude);  // 创建点坐标B--江北区
                this.map.setCenter(pointA);
            },  ( e )=> {
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
        // 百度地图API功能
        return (
            <div className={css.main}>
                <div className={css.mainTop}>
                    <div ref="baiDu" className={css.baiDu}/>
                    <img className={css.baiDuCenter} src={require("./../bdl.png")}/>
                    <img
                        onClick={() => {
                            //反加当前的定位地址
                            this.toLocation();
                        }}
                        className={css.baiDuLocation} src={require("./../icon_location.png")}/>
                </div>

                <div className={css.bottomViewTitle}>
                    请选择地址
                </div>
                <ListView
                    className={css.bottomView}
                    getListData={this.loadData.bind(this)}
                    getItemView={this.getItemView.bind(this)}
                    action={(clear, loadMore, size, first) => {
                        this.clear = clear;
                        this.loadMore = loadMore;
                        this.listSize = size;
                        if (first) {
                            //loadMore();
                        }

                    }}
                />
            </div>
        );
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
    getItemView(data, position) {
        //修复非正常路由下的页面跳转
        return (
            <div key={position}
                 onClick={() => {
                     //选择
                     if(this.props.callBack){
                         this.props.callBack(data);
                     }
                    this.back();
                 }}
                 className={css.row}
            >
                <div className={css.rowTitle}>{data.name}</div>
                <div className={css.rowAddress}>{data.address}</div>
                <img className={css.rowImg} src={this.img_rightSelect}/>
            </div>
        );
    }
}
module.exports = page;