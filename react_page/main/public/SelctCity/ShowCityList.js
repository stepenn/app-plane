/**
 * Created by lixifeng on 17/5/29.
 */
/**
 * Created by lixifeng on 17/5/29.
 */
import React, {Component} from 'react';

import HttpTool from '../../../http/HttpTool.js';
import APILXF from '../../../http/APILXF.js';
import css from './ShowCityList.less';
import ClickHelp from '../../../tool/ClickHelp.js';

class index extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        if(this.props.search){
            this.props.search(this.search.bind(this));
        }
        if(this.props.hidden){
            this.props.hidden(this.hidden.bind(this));
        }
        this.img_inputPW = window.imgHost + '/images/input_PW.png';
    }
    hidden(){
        this.setState(
            {
                data:[]
            }
        );
    }
    search(v){
        this.loadMoreData(v);
    }
    render(){
        return(
            <div className={this.state.data&&this.state.data.length>0?css.showContent:css.showContentHidden}>
                {this.getRows(this.state.data)}
            </div>
        );
    }
    getRows(data){
        if(!data){return null;}
        var viewS = [];
        for(let i in data){
            let obj = data[i];
            viewS.push(
                <div className={css.row} style={{
                    backgroundImage: `url(${this.img_inputPW})`
                }} key={i}
                     {...ClickHelp.onClick(()=>{
                         if(this.props.select){
                             this.props.select(obj);
                         }
                         this.hidden();
                     })}
                >
                    {obj.city_name}
                </div>
            )
        }
        return viewS;
    }

    loadMoreData(keyword){
        if(!keyword){
            this.setState(
                {
                    data:[]
                }
            );
            return;
        }
        var successCallback = (code, message, json, option) => {
            this.setState(
                {
                    data:json
                }
            );
        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    data:[]
                }
            );
        };
        var param = {

        };
        if(this.props.param){
            param = this.props.param;
        }
        param.keyword = keyword,
        HttpTool.post(this.props.api, successCallback, failCallback,param );
    }
}
module.exports = index;