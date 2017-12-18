/**
 * Created by apin on 2017/6/2.
 */
import React, {Component} from 'react';
import css from './SelectCity.less';
import Toast from '../../../component/Toast/index.js';
import HttpTool from '../../../http/HttpTool.js';
import APILXF from '../../../http/APILXF.js';
import ClickHelp from '../../../tool/ClickHelp.js';
import Button from '../Button/index.js';
import ShowCityList from './ShowCityList.js';
import HelpI from '../../../help/Help.js';

import LocationHelp from '../../plus/LocationHelp.js';
class page extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();

        this.img_input = window.imgHost+"/images/img_input.png";
        this.state = {
            locationCity:[],
            nearCity: [],
        }
    }
    getImgUrl(url) {
        if(url){
            return `url(${url})`;
        }else{
            return null;
        }
    }

    animEnter(){
        LocationHelp.openLocation((p)=>{
            this.setState({

                locationCity:[{city_name:p.address.city}]
            });
            this.loadNearCity(p);
            //请求附近城市
        },(e)=>{
            Toast.showToast(e.message)
        })

    }
    render() {
        var div = (
            <div className={css.bg}
                 onClick={(e)=>{
                     ClickHelp.stopClick(e);
                     this.hidden();
                 }}
            >
                <div className={css.siegeText} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_input)
                }}>
                    <input onClick={(e)=>{
                        ClickHelp.stopClick(e);
                    }}
                           autoFocus
                           ref={"dom"}
                           className={css.textArea}
                           type="text"
                           placeholder={"城市名或字母"}
                           onChange={(event) => {
                               var v = event.target.value;
                               this.search(v);
                               ClickHelp.stopClick(event);
                           }}/>
                </div>

                <div className={css.showContent}>
                    <div className={css.title}>当前城市:</div>
                    {this.getTags(this.state.locationCity)}
                    <div className={css.title}>附近城市:</div>
                    {this.getTags(this.state.nearCity)}
                    <div className={css.actionLayout}>
                        <div className={css.action}>
                            <Button
                                onClick={(e)=>{
                                    this.close();
                                    ClickHelp.stopClick(e);
                                }}>取消
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={css.showContent2}
                >
                    <ShowCityList
                        param={{abroad:1}}
                        api={APILXF.api_common_gitCityList}
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

        )
        return this.Help.app_render(this,div);
    }


    getTags(data){
        if(!data){return null;}
        var viewS = [];
        for(let i in data){
            let obj = data[i];
            viewS.push(
                <div className={css.tag} key={i}
                     onClick={(e)=>{
                         ClickHelp.stopClick(e);
                         this.close(obj);
                     }}
                >
                    {obj.city_name}
                </div>
            )
        }
        return viewS;
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
    loadNearCity(location){
        var successCallback = (code, message, json, option) => {
            this.setState(
                {
                    nearCity:json
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
        pa.maxCount = 10;
        HttpTool.post(APILXF.api_route_getNearCities, successCallback, failCallback, pa);
    }

}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;