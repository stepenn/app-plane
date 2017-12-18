/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import ListView from '../../component/ListView/ListView.js';
import HelpI from '../../help/Help.js';
/**
 * 带导航的页面
 */
class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
    }
    render() {
        var div = (
            <ListView
                getListData={this.loadData.bind(this)}
                getItemView={this.getItemView.bind(this)}
                action={(clear, loadMore, size, first) => {

                    if (first) {
                        this.loadMore = loadMore;
                        this.clear = clear;
                        loadMore();
                    }
                }}
            />
        );
        return this.Help.app_render(this,div);
    }
    getItemView(data, position){
        return <div
            style={{
                background:"#ff00aa",
                padding:"10px",
                margin:"10px",
                boxSizing: "border-box"
            }}
            onClick={()=>{
                alert("position:"+position);
            }}
            key={position}
        >{data.title}</div>;
    }
    loadData(callparms) {


        //参数
        var param={
        };
        var successCallback = (code, message, json,option)=> {
            // alert(json);
            // alert(code+message);
            callparms.success(json);
        };
        var failCallback = (code, message,option)=> {
            callparms.error(code+message);
        };

        var json = [];
        for(var i=0;i<20;i++){
            json.push({
                title: "这是标题"+i,
            })
        }
        setTimeout(()=>{
            callparms.success(json);
        },2000);

        // HttpTool.post( HttpTool.APILXF.api, successCallback, failCallback,param);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;