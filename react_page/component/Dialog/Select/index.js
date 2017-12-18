/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import  Select from './Select.js';
import  DialogTool from '../DialogTool.js';
module.exports = {

    open(cb,option,callBack){
        let id = "MYETCVIEW_Select";
        if(!option){
            option = {};
        }
        if(!callBack){
            callBack = (v)=>{};
        }
        var t =  <Select
            option={option}
            callBack={cb}
            onCancel={()=>{
                DialogTool.back(callBack);
            }}

        />;
        DialogTool.render(id,t);

    }

};
