/**
 * Created by lixifeng on 16/11/22.
 */
//引用react
import React, {Component} from 'react';
var JRoll = require('jroll');
// 创建一个UIDemo类
class ScrollDiv extends Component{
    constructor(props) {
        super(props);

        var v = ("time_"+new Date().getTime()+this.randomString(6));
        var idv = this.props.idv?this.props.idv+v:v;
        this.idsv = "sv_"+idv;
        this.idsvsc = "svsc_"+idv
    }
    randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
    }
    componentDidMount(){
       var option =  {
            id:"#"+this.idsvsc,
        }
        if( typeof(this.props.y) == "undefined" ){
            option.scrollY=true;
        }else{
            if(this.props.y){
                option.scrollY=true;
                option.scrollBarY=true;
            }else{
                option.scrollY=false;
                option.scrollBarY=false;
            }
        }
        if(this.props.x){
            option.scrollX=true;
            option.scrollBarX=true;
        }
        // var jroll = new JRoll("#interactive", {scroller:"#interactivescroll",scrollBarY:true});
        var jroll = new JRoll("#"+this.idsv,option);
        jroll.refresh();
        jroll.enable();
        jroll.on("scrollStart", ()=> {
            jroll.refresh();
        });
        jroll.on("scroll", () =>{
            //该干嘛干嘛去...
            if(this.props.callBackScrollY){
                this.props.callBackScrollY(jroll.y);
            }
        });
        if(this.props.callBack){
            this.props.callBack(jroll);
        }


    }
    componentDidUpdate(prevProps, prevState){


    }

    render(){
        return (
            <div {...this.props}  id={this.idsv}>
                <div {...this.props.pro} id={this.idsvsc}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
module.exports = ScrollDiv;