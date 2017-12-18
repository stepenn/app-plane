/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import Loading from './Loading.js';
import  DialogTool from '../DialogTool.js';

module.exports = {
    show(show,callBack){
        // 监听页面,是否返回
        var id = "MYETCVIEW_Loading";
        if (show) {
            var t = <Loading />;
            DialogTool.render(id,t);
        } else {
            DialogTool.back(callBack);
        }


    }

};
