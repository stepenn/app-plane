/**
 * Created by lixifeng on 16/8/1.
 */

import JSONHelp from './JSONHelp'

import  CookieHelp from  "../tool/CookieHelp.js";
import  ShareHelp from  "../tool/ShareHelp.js";
import  Config from  "../Config.js";
import crypto from 'crypto';
let HttpTool = {
    showLog:true,//是否打印,请求日志

    printJson(json){
        return JSONHelp.printJson(json);//一次性打印完
    },
    print(value){
        if(HttpTool.showLog){
            log(value);
        }
    },
    printWarn(value){
        if(HttpTool.showLog) {
            log(value);
        }
    },
    randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    isApp(){
        return !Config.ISSAP&&window.plus;
    },
send(url,param,failCall,successCall,allJson,otherO){
        //此URL,用来跨域


    var xmlHttp = null;
    if(this.isApp()){
        //原生请求
        url = window.ApinDomain+url;
        xmlHttp = new plus.net.XMLHttpRequest();
    }else{
        if (window.XMLHttpRequest) {

            //针对chrome,firefox 等浏览器创建 xmlhttprequest 对象
            xmlHttp = new XMLHttpRequest();
            if (xmlHttp.overrideMimeType) {
                //针对http传输mime类型不是 text/xml 时的设置.vv
                xmlHttp.overrideMimeType('text/xml');
            }
        } else if (window.ActiveXObject) {
            //针对变态浏览器IE及其各版本创建 xmlhttprequest 对象
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    log('Microsoft.XMLHTTP xmlHttpRequest Generation error!', e);
                    var option = {
                        code:-1,
                        message:"Microsoft.XMLHTTP xmlHttpRequest Generation error!",
                    }
                    return failCall(option.code,option.message,option);
                }
            }
        }
    }


        var paramsDemo="";
        HttpTool.print("开始请求:"+url+  "参数:↓");
        HttpTool.print(param);
        if ( param) {
            //POST请求,用来跨域
            var i=0;
            for (var key in param) {
                paramsDemo += i == 0 ? (key + '=' + param[key]) : ('&' + key + '=' + param[key]);
                ++i;
            }

        }
        HttpTool.print("参数:"+paramsDemo);

        xmlHttp.open("POST", url, true);
        if(otherO){
            if(otherO.ukey){
                xmlHttp.setRequestHeader("UKEY",otherO.ukey);
            }
        }

        var apinkey = CookieHelp.getCookieInfo("apinkey");;


        if(!apinkey){
            var option = {
                code:-2,
                message:"no apinkey",
            }
            return failCall(option.code,option.message,option);

        }


        var time = new Date().getTime();


        var nonceStr = this.randomString();
        var key = apinkey + "," + time + "," + nonceStr;

        var sign = crypto.createHash("md5").update(key).digest("hex");
    log("key:"+key);
    log("sign:"+sign);
    log("timestamp:"+time);
    log("nonceStr:"+nonceStr);
        xmlHttp.setRequestHeader("timestamp", time.toString());
        xmlHttp.setRequestHeader("sign", sign);
        xmlHttp.setRequestHeader("nonceStr", nonceStr);


    // UKEY:"hahahahahahah"
        xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    xmlHttp.overrideMimeType("text/html;charset=UTF-8");//设定以gb2312编码识别数据

    xmlHttp.timeout = 60000;

        try {
            if(paramsDemo){
                xmlHttp.send(paramsDemo);
            }else{
                xmlHttp.send();
            }

        } catch (e) {
            log('error!', e);
            var option = {
                code:-1,
                message:"send error"+e,
            }
            return failCall(option.code,option.message,option);
        }


        //ajax 请求状态变化监听
        xmlHttp.onreadystatechange = function () {
            // readState == 4 请求完成

            if (xmlHttp.readyState == 4) {
                HttpTool.print("响应码:"+ xmlHttp.status +"   服务器:"+url);
                //状态码 返回 200 表示请求成功

                if(xmlHttp.status == 200){
                    //解析结果
                    //转JSON
                    var json = {};
                    try{
                        json =  JSON.parse(xmlHttp.responseText);
                    }catch (e){
                        var option = {
                            code:-1,
                            message:"no json data",
                            option:{},
                        };

                        failCall(option.code,option.message,option)
                        return;
                    }
                    HttpTool.print("请求数据:↓↓↓↓↓↓↓下一行↓↓↓↓↓↓↓↓↓↓↓");//打印结构
                    HttpTool.print(json);//打印结构
                    //  HttpTool.print(JSONHelp.printJson(responseJson));//一次性打印完

                    if(allJson){
                        var option = {
                            code:1,
                            message:"success",
                        };
                        successCall(option.code,option.message,json,option);
                    }else{
                        var option = {
                            code:json.code,
                            message:json.msg,
                            option:json.option,
                        };

                        if(json.code>0){
                            successCall(option.code,option.message,json.data,option);
                        }else{
                            failCall(option.code,option.message,option)
                        }
                    }

                }else{

                    var errorCode ,errorMsg;
                    errorCode = xmlHttp.status;
                    var oCode = parseInt(errorCode / 100);
                    switch (oCode){
                        case 1:
                            errorMsg = '请使用更高版本的HTTP协议';
                            break;
                        case 2:
                            errorMsg = '请使用更高版本的HTTP协议';
                            break;
                        case 3:
                            errorMsg = '请求跳转到新的URL';
                            break;
                        case 4:
                            errorMsg = '客户端请求的资源不存在 code:'+errorCode;
                            break;
                        case 5:
                            errorMsg = '服务器端错误';
                            break;
                        case 10:
                            errorMsg = '服务器连接错误';
                            break;
                        default:
                            errorMsg = "其它错误";
                            break;
                    }
                    HttpTool.print("请求错误:code:"+errorCode+" msg:"+errorMsg);
                    HttpTool.print(xmlHttp.responseText);
                    var option = {
                        code:errorCode,
                        message:errorMsg,
                    };
                    failCall(option.code,option.message,option);
                }

            }else{
                // failCall(xmlHttp.readyState,"error: readyState="+xmlHttp.readyState);
            }
        };
    },

    /**
     *
     * @param param // var param=  JSON.stringify({p: 1, pc: 10,});
     * @param zd_type // var zd_type = HttpTool.Course_getCourseList;
     * @param successCallback
     *  var successCallback = (code,message,json)=>{
                     HttpTool.print("返回 code:"+ code);
                     HttpTool.print("返回 message:"+ message);
                     HttpTool.print("返回 json:"+ json);
                };

     * @param failCallback
     *   var failCallback = (code,message)=>{
                    console.warn("错误 code:"+ code);
                    console.warn("错误 message:"+ message);
                };
     */
    post:(url, successCallback, failCallback,param) =>{
        //option 参数必须是对象,里面包括 (type 请求方式,url 请求路径,param 请求参数)

        var successCall = (code,message,json,option)=>{
            successCallback(code,message,json,option);
            HttpTool.print("返回 code:"+ code);
            HttpTool.print("返回 message:"+ message);
            HttpTool.print("返回 json:↓↓↓↓↓↓↓下一行↓↓↓↓↓↓↓↓↓↓↓");
            HttpTool.print(json);
        };
        var failCall = (code,message,option)=>{
            failCallback(code,message,option);
            HttpTool.printWarn("错误 code:"+ code);
            HttpTool.printWarn("错误 message:"+ message);
        };

        if(!url){
            var option = {
                code:-1,
                message:"no url",
            }
            failCall(option.code,option.message,option);
            return;
        }
        //如果参数对象option 包括 param 参数对象
        if(!param){
            param = {}
        }

        var user = CookieHelp.getUserInfo();
        var ukey = "";
        if(user&&user.ukey){
            ukey = user.ukey;
        }

        HttpTool.send(url,param,failCall,successCall,false,{ukey:ukey});
    },
    otherApi(url,successCallback, failCallback,param){

        var successCall = (code,message,json,option)=>{
            successCallback(code,message,json,option);
            HttpTool.print("返回 code:"+ code);
            HttpTool.print("返回 message:"+ message);
            HttpTool.print("返回 json:↓↓↓↓↓↓↓下一行↓↓↓↓↓↓↓↓↓↓↓");
            HttpTool.print(json);
        };
        var failCall = (code,message,option)=>{
            failCallback(code,message,option);
            HttpTool.printWarn("错误 code:"+ code);
            HttpTool.printWarn("错误 message:"+ message);
        };

        //如果参数对象option 包括 param 参数对象
        if(!param){
            param = {}
        }
         HttpTool.send(url,param,failCall,successCall,true);
    }


}

export default HttpTool;