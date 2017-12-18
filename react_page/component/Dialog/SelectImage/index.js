/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import SelectImage from './SelectImage.js';
import  DialogTool from '../DialogTool.js';

module.exports = {
    open(cb,option,callBack){
        let id = "MYETCVIEW_SelectImage20170410";
        if(!option){
            option = {};
        }
        if(!callBack){
            callBack = (v)=>{};
        }
        var t =  <SelectImage
            option={option}
            callBack={cb}
            onCancel={()=>{
                DialogTool.back(callBack);
            }}

        />;
        DialogTool.render(id,t);
    }

};
