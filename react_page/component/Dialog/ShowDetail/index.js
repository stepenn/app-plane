/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import ShowDetail from './ShowDetail.js';
import  DialogTool from '../DialogTool.js';
module.exports = {
    open(option, callBack){
        // 监听页面,是否返回
        var id = "MYETCVIEW_ShowDetail";

        var t = <ShowDetail
            option={option}
            onCancel={() => {
                DialogTool.back(callBack);
            }}

        />;
        DialogTool.render(id,t,callBack);


    }

};
