/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import  ImageSee from './ImageSee.js';
import  DialogTool from '../DialogTool.js';
module.exports = {


    open(option,callBack){
        let id = "MYETCVIEW_ImageSee";
        if(!option){
            option = {};
        }

        if(!callBack){
            callBack = (v)=>{};
        }
        var t =  <ImageSee
            option={option}
            onCancel={()=>{
                DialogTool.back(callBack);
            }}

        />;
        DialogTool.render(id,t);

    }

};
