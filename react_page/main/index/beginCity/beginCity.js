import React, { Component } from 'react';
import css from  './beginCity.less';
import HelpI from '../../../help/Help.js';
import  ScrollView from  '../../../component/ScrollDiv/ScrollDivCom.js';
import ShowCityList from '../../public/SelctCity/ShowCityList.js';
import LocationHelp from '../../plus/LocationHelp.js';
import ClickHelp from '../../../tool/ClickHelp.js';
import Toast from '../../../component/Toast/index.js';
import APISP from '../../../http/APISP.js';
import  HttpTool from  '../../../http/HttpTool.js';

 class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.isBegin = this.Help.app_getParameter(this).step==0;

        if( this.isBegin ){
            this.state ={
                locationCity:[],
                nearCity: [],
                show:true,
            }
        }else{
            this.state = {
                hotCity:[],
                UserCity:[],
                show:true,

            }
        }
        this.img_balloon = window.imgHost + '/images/balloon.png';
        this.img_input = window.imgHost + '/images/img_input.png';
        this.img_inputPW = window.imgHost + '/images/input_PW.png';
    }
     componentWillUnmount(){
         this.Help.close(this);
     }

     close(city) {
         if(city){
             this.Help.setIntent(city);
         }
         this.Help.back(this);

     }

     animEnter(){
         if(this.isBegin){
             LocationHelp.openLocation((p)=>{

                 this.loadNearCity(p);
                 //请求附近城市
             },(e)=>{
                 Toast.showToast(e.message)
             })
         }else{
             this.loadHotCity();
             this.loadUserCity();
         }
     }

     loadHotCity(){
         var successCallback = (code, message, json, option) => {
             this.setState(
                 {
                     hotCity:json,
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
         var pa = this.Help.app_getParameter(this).postValue;
         if(!pa){
             pa = {};
         }
         pa.maxCount = 3;
         HttpTool.post(APISP.api_route_getHotCities, successCallback, failCallback, pa);
     }
     loadUserCity(){
         var successCallback = (code, message, json, option) => {
             if(json&&json.length>0){
                 //没有返回城市
                 this.setState(
                     {
                         UserCity:json,
                     }
                 );
             }else{
                 this.setState(
                     {
                         UserCity:json,
                         show:false,
                     }
                 );
             }

         };
         var failCallback = (code, message) => {
             this.setState(
                 {
                     UserCity:[]
                 }
             );
         };
         var pa = this.Help.app_getParameter(this).postValue;
         if(!pa){
             pa = {};
         }
         pa.maxCount = 6;
         HttpTool.post(APISP.api_route_getUserCommendedCities, successCallback, failCallback, pa);
     }
     /**
      * 得到附近行线的城市
      * @param location
      */
     loadNearCity(location){


         var successCallback = (code, message, json, option) => {
             // this.setState({
             //     locationCity:[{city_name:p.address.city}]
             // });
             this.setState(
                 {
                     locationCity:json.slice(0,1),
                     nearCity:json.slice(1,json.length)
                 }
             );
         };
         var failCallback = (code, message) => {
             this.setState(
                 {
                     nearCity:[]
                 }
             );
         };
         var pa =  location.location;
         pa.maxCount = 7;
         HttpTool.post(APISP.api_route_getNearCities, successCallback, failCallback, pa);
     }
    render(){

        var pa = this.Help.app_getParameter(this).postValue;
        if(!pa){
            pa = {};
        }
        pa.maxCount = 3;
        pa.fromOrTo = this.isBegin?"from":"to";

        var main =   null;
        if(this.state.show){
            main = (
                <div>
                    <div className={css.siegeText} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_input)
                    }}>
                        <input onClick={(e)=>{
                            ClickHelp.stopClick(e);
                        }}
                               autoFocus
                               className={css.textArea}
                               type="text"
                               placeholder={"城市名或字母"}
                               onChange={(event) => {
                                   var v = event.target.value;
                                   this.search(v);
                                   ClickHelp.stopClick(event);
                               }}/>
                    </div>

                    {this.isBegin?this.getBeginCity():this.getEndCity()}

                    <div className={css.showContent}
                    >
                        <ShowCityList
                            api={APISP.api_route_searchDepartCities}
                            param={pa}
                            search={(fun)=>{
                                this.search = fun;
                            }}
                            hidden={(fun)=>{
                                this.hidden = fun;
                            }}
                            select={(obj)=>{
                                this.close(obj);
                            }}

                        />
                    </div>
                </div>
            );
        }else{
            main = <div className={css.css_layout_none}>{"无"+this.Help.app_getParameter().title+"城市列表"}</div>
        }
        var div = (
                <ScrollView className={css.main}>
                    {main}
                </ScrollView>
        );
        return this.Help.app_render(this,div,{});
    }

    getBeginCity(){
        return (
            <div>
                <div className={css.barTitle} style={{
                    backgroundImage:this.Help.getImgUrl(this.img_inputPW)
                }}>起航城市</div>
                <div className={css.cityList }>
                    {this.getTags(this.state.locationCity)}
                </div>

                <div className={css.barTitle} style={{
                    backgroundImage:this.Help.getImgUrl(this.img_inputPW)
                }}>附近城市</div>
                <div className={css.cityList }>
                    {this.getTags(this.state.nearCity)}
                </div>
            </div>
        );
    }
     getEndCity(){
         return (
             <div>
                 <div className={css.barTitle} style={{
                     backgroundImage:this.Help.getImgUrl(this.img_inputPW)
                 }}>伙伴着陆城市推荐</div>
                 <div className={css.cityList }>
                     {this.getTags(this.state.hotCity)}
                 </div>

                 <div className={css.barTitle} style={{
                     backgroundImage:this.Help.getImgUrl(this.img_inputPW)
                 }}>主推着陆城市</div>
                 <div className={css.cityList }>
                     {this.getTags(this.state.UserCity)}
                 </div>
             </div>
         );
     }
     getTags(data){
         if(!data){return null;}
         var viewS = [];
         for(let i in data){
             let obj = data[i];
             viewS.push(
                 <div className={css.city}
                      key={i}
                      {...ClickHelp.onClick((e)=>{
                          ClickHelp.stopClick(e);
                          this.close(obj)
                      })}
                 >
                     <img className={css.cityImg} src = {this.img_balloon} />
                     <div className={css.cityTitle}>{obj.city_name}</div>
                 </div>
             )
         }
         return viewS;
     }

}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;