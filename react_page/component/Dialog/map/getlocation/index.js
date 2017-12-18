/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import  GetLocationMap from './GetLocationMap.js';
import  DialogTool from '../../DialogTool.js';

module.exports = {
    open(callBack){
        let id = "MYETCVIEW_GetLocationMap";
        if(!callBack){
            callBack = (v)=>{};
        }
        var t =  <GetLocationMap
            callBack={callBack}
            onCancel={()=>{
                DialogTool.back();
            }}
        />;
        DialogTool.render(id,t);

    }

};
