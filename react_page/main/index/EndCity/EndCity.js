import React, { Component } from 'react';
import css from  '../beginCity/beginCity.less';
import HelpI from '../../../help/Help.js';
import ShowCityList from '../../public/SelctCity/ShowCityList.js';
import ClickHelp from '../../../tool/ClickHelp.js';
import APISP from '../../../http/APISP.js';
import  HttpTool from  '../../../http/HttpTool.js';
import  ScrollView from  '../../../component/ScrollDiv/ScrollDivCom.js';
class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.Help.setPageAnimOption({type:"bottom"});
        this.state = {
            hotCity:[],
            UserCity:[],
            success:false
        }
        this.img_balloon = window.imgHost + '/images/balloon.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    loadHotCity(){
        var successCallback = (code, message, json, option) => {
            this.setState(
                {
                    hotCity:json,
                    success:true
                }
            );
        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    hotCity:[]
                }
            );
        };
        HttpTool.post(APISP.api_route_getHotCities, successCallback, failCallback, {
            maxCount:3
        });
    }
    componentDidMount(){
        this.loadHotCity();
        this.loadUserCity();
    }
    render(){
        var div = (
            <ScrollView className={css.main}>
                    <div className={css.search}>
                        <input type="text" className={css.txtArea} placeholder="搜索"
                               onClick={(e)=>{
                                   ClickHelp.stopClick(e);
                               }}
                               autoFocus
                               ref={"dom"}
                               onChange={(event) => {
                                   var v = event.target.value;
                                   this.searchCity(v);
                                   ClickHelp.stopClick(event);
                               }}
                        />
                    </div>
                    <div className={css.homeField}>伙伴着陆城市推荐</div>
                    <div className={css.nearCity }>
                        {this.state.success?this.getTags(this.state.hotCity):null}
                    </div>
                    <div className={css.homeField}>主推着陆城市</div>
                    <div className={css.nearCity }>
                        {this.state.success?this.getTags(this.state.UserCity):null}
                    </div>
                    <div className={css.showContent2}
                    >
                        <ShowCityList
                            searchCity={(fun)=>{
                                this.searchCity = fun;
                            }}
                            hidden={(fun)=>{
                                this.hidden = fun;
                            }}
                            select={(obj)=>{
                                this.close(obj);
                            }}

                        />
                    </div>
            </ScrollView>
        )
        return this.Help.app_render(this,div,{});
    }
    getTags(data){
        if(!data){return null;}
        var viewS = [];
        for(let i in data){
            let obj = data[i];
            viewS.push(
                <div className={css.nearList} key={i}
                     onClick={(e)=>{
                         ClickHelp.stopClick(e);
                         this.Help.setIntent(obj.city_name)
                         this.Help.back(this)
                         this.Help.app_open(this,'/',{
                             address:obj.city_name

                         });
                         this.close(obj);
                     }}
                >
                    <img className={css.nearImg} src = {this.img_balloon} />
                    <p>{obj.city_name}</p>

                </div>
            )
        }
        return viewS;
    }
    close(city) {
        if(city){
            this.Help.setIntent(city);
        }
        this.Help.back(this);

    }
    loadUserCity(){
        var successCallback = (code, message, json, option) => {
            this.setState(
                {
                    UserCity:json,
                    success:true
                }
            );
        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    UserCity:[]
                }
            );
        };
        HttpTool.post(APISP.api_route_getUserCommendedCities, successCallback, failCallback, {
            maxCount:6
        });
    }
}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
