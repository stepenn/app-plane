/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import SelectData from './SelectData';
import  DialogTool from '../DialogTool.js';
module.exports = {
    open(onSelect,datas){
        let id = "MYETCVIEW_SelectData";
        var t =  <SelectData
            onSelect={(value,indexs,lastData)=>{
                if(onSelect){
                 onSelect(value,indexs,lastData);
                }
                DialogTool.back();
            }}
            datas={datas}
            onCancel={()=>{
                DialogTool.back();
            }}

        />;
        DialogTool.render(id,t);

    }

};
