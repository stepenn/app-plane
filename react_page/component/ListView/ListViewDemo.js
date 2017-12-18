/**
 * Created by lixifeng on 16/11/1.
 */
import React, {Component} from 'react';
import Base from '../../Base.js';
import css from './ListViewDemo.css';
import ListView from './ListView.js';
import ListViewItem from './ListViewItem.js';
class ListViewDemo extends  Base{

    //模拟ajax
    getMyData(parms) {
        var data = [];
        for (var i = 1; i <= 20; i++) {
            data.push({
                index: "V"+i,
                text: "下拉刷新=无限加载",
                title:"title"+i,
                msg:{
                    "abc":"aabbcc",
                }
            });
        }
        //模拟接口请求
        setTimeout(()=>{
            parms.success(data);
            // parms.error({code:404,message:"no found api"});
        }, 800);
    }

    getItemView(data, position){
        return (
            <ListViewItem  data={data} key={"key"+position} position={position} />
        );
    }
    rs(){

        return (
        <div  className={css.main}>
            <ListView
                className={css.ListView}
                getListData={this.getMyData}
                getItemView={this.getItemView}
                start={true}

            />
        </div>
        );
    }
}
module.exports = ListViewDemo;