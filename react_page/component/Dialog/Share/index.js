/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import Share from './Share.js';
import  DialogTool from '../DialogTool.js';
module.exports = {
    open(cb,option,callBack){
        let id = "apin_MYETCVIEW_Share";
        if(!option){
            option = {};
        }
        if(!cb){
            cb = (v)=>{};
        }
        if(!callBack){
            callBack = (v)=>{};
        }
        var t =  <Share
            option={option}
            callBack={cb}
            onCancel={()=>{
                DialogTool.back(callBack);
            }}

        />;
        DialogTool.render(id,t,callBack);

    }

};
