/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import  ShowMap from './ShowMap.js';
import  DialogTool from '../../DialogTool.js';

module.exports = {
    open(option,callBack){
        let id = "MYETCVIEW_ShowMap";
        if(!callBack){
            callBack = (v)=>{};
        }
        if(!option){
            option = {};
        }
        var t =  <ShowMap
            option={option}
            onCancel={()=>{
                DialogTool.back(callBack);
            }}
        />;
        DialogTool.render(id,t);

    }

};
