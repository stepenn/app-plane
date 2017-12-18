/**
 * Created by apin on 2017/6/14.
 */
import HttpTool from  "../http/HttpTool.js";
import APIGYW from  "../http/APIGYW.js";

module.exports = {
    bindDevice(num){
        if(!window.plus){
            return;
        }
        if(num>5){
            return;
        }
        var i = num +1;
        window.apinapi("pushRegistId",{}, (json)=> {
            var obj = JSON.parse(json); //由JSON字符串转换为JSON对象
            if (obj.code == 1){
                this.getDevice(obj.body,i);
            }
        }, (error)=> {
            setTimeout(()=>{
                this.bindDevice(i)
            },1000)

        });
    },
    getDevice(device,num)
    {
        if (!device){
            this.bindDevice(num);
            return;
        }
        var param = {
            registration_id:device,
        };
        var successCallback = (code, message, json, option) => {
            if (code ==1 ){

            }
        };
        var failCallback = (code, message) => {
            this.bindDevice(num);
        };
        HttpTool.post(APIGYW.api_user_bindRegistrationId, successCallback, failCallback, param);
    },
};