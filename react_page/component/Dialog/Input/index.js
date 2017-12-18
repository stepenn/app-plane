/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import Message from './Message.js';
import  DialogTool from '../DialogTool.js';
module.exports = {
    open(callBack,option){
        let id = "MYETCVIEW_MessageInput";
        if(!option){
            option = {};
        }

        if(!callBack){
            callBack = (v)=>{};
        }
        var t =  <Message
            option={option}
            callBack={callBack}
            onCancel={()=>{
                DialogTool.back();
            }}

        />;
        DialogTool.render(id,t);

    }

};
