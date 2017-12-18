/**
 * Created by lixifeng on 17/1/5.
 */
/**
 * 打开弹窗,代码抽象层
 * @type {{}}
 */
import React from 'react';
import ReactDOM from 'react-dom';
module.exports = {
    clear(){
        if(!this._div){
            return;
        }
        document.body.removeChild(this._div);
        this._div = null;
    },
    back(callBack){

        if (this._div) {
            this.onC(callBack);
            window.history.back();
            // this.clear();
        }else{
            if(callBack){
                callBack();
            }
        }

    },
    render(id,view,callBack){
        this._div = document.getElementById(id)
        if(!this._div){
            this._div =  document.createElement('div');
            this._div.id = id;
            document.body.appendChild(this._div);

            this.hash = window.location.hash;
            window.location.hash = this.hash+(this.hash.indexOf("?")>0?"&":"?")+"comId="+id;
            this.onC(callBack);
        }else{
            //存在,不进行修改URL
        }


        ReactDOM.render(view, this._div);
    }
    ,
    onC(callBack){
        window.me_hashListen = () => {

            if (window.location.hash === this.hash) {
                window.me_hashListen = null;
                this.clear();
                if(callBack){
                    callBack();
                }
            }
        };
    }

}