/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import ToastMessage from './ToastMessage';
module.exports  = {
    showToast(title, bgcolor, fontcolor){
        if (!title) {
            title = "未知提示";
            // title = "Toast cannot be null";
            // bgcolor = "red";
        }


        this._div = document.getElementById("MYETCVIEW_Toast");
        if(!this._div){
            this._div =  document.createElement('div');
            this._div.id = "MYETCVIEW_Toast";
            document.body.appendChild(this._div);

            var t = <ToastMessage
                key={"keyV"}
                title={title}
                bgcolor={bgcolor}
                fontcolor={fontcolor}

                updata={(setTitle)=>{
                    this.setTitle = setTitle;
                }}

            />;
            ReactDOM.render(t, this._div);
        }
        if(!this.index){
            this.index = 0 ;
        }
        this.index ++ ;

        if(this.setTitle){
            this.setTitle(title, bgcolor, fontcolor);
        }


    }

};
