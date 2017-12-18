/**
 * Created by apin on 2017/6/1.
 */
import React, {Component} from 'react';
import css from './ItemUpLoadImg.less';

import HttpTool from '../../http/HttpTool.js';
import APIGYW from '../../http/APIGYW.js';
import Loading from '../../component/Dialog/Loading/index.js';
import Toast from '../../component/Toast/index.js';
import CookieHelp from '../../tool/CookieHelp.js';

import ImageUp from '../public/ImageUp/index';
class index extends Component {
    constructor(props){
        super(props);
        this.userInfo =  CookieHelp.getUserInfo();
        this.imgArr = [];
        if (this.userInfo.images){
            this.imgArr = this.userInfo.images.split(",");
        }

        this.state = {
            upData:0,
        };
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }
    render(){
        var {}=this.props;
        return (
            <div className={css.imgArea}>
                {this.createImgItem()}
            </div>
        );
    }

    createImgItem(){
        var imgItemArr =[];
        for(var i = 0;i<this.imgArr.length;i++){
            let index = i;
            let image = this.imgArr[index];
            var imgView = (<div key={index+"aaa"} className ={css.imgItemBg}>
                <ImageUp src={image} clearListen={()=>{
                             this.delImg(image,index);
                         }}
                />
            </div>);
            imgItemArr.push(imgView);
        }
        if (this.imgArr.length<5){
            var imgView = (<div key={this.imgArr.length+"aaa"} className={css.imgItem}>
                <ImageUp successListen={(url)=>{
                        this.commitImg(url);
                    }}
                />
            </div>);
            imgItemArr.push(imgView);
        }
        return imgItemArr;
    }

    //上传用户图片
    commitImg(base64){
        var param={image:base64}
        var successCallback = (code, message, json, option) => {
            this.userInfo = CookieHelp.getUserInfo();
            if (!this.userInfo.images){
                this.userInfo.images = base64;
            }else {
                this.userInfo.images +=","+ base64;
            }
            CookieHelp.saveUserInfo(this.userInfo);
            this.imgArr.push(base64);
            this.upView();
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_uploadUserImage, successCallback, failCallback, param);
    }

    //删除用户图片
    delImg(imgUrl,index){
        var param={imgsrc:imgUrl}
        var successCallback = (code, message, json, option) => {
            this.remove(index,this.imgArr);
            var myImgStr ="";
            for (let i=0;i<this.imgArr.length;i++){
                if (i==this.imgArr.length-1){
                    myImgStr = myImgStr +this.imgArr[i];
                }else {
                    myImgStr = myImgStr +this.imgArr[i]+",";
                }
            }
            this.userInfo.images = myImgStr;
            CookieHelp.saveUserInfo(this.userInfo);
            this.upView();
        };
        var failCallback = (code, message) => {
            Toast.showToast(message);
        };
        HttpTool.post(APIGYW.api_user_delUserImage, successCallback, failCallback, param);
    }
    remove(dx, arr) {
        if (isNaN(dx) || dx > arr.length) {
            return false;
        }
        for (var i = 0, n = 0; i < arr.length; i++) {
            if (arr[i] != arr[dx]) {
                arr[n++] = arr[i]
            }
        }
        arr.length -= 1
    }
}
module.exports = index;