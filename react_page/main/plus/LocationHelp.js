/**
 * Created by lixifeng on 17/5/25.
 */
import  HttpTool from  '../../http/HttpTool.js';
import  APILXF from  '../../http/APILXF';
module.exports = {
    /**
     *
     * @param successBack
     * @param errorBack
     * 成功返回 :
     *  address		object
     *      city		string	城市
     *      country		string	国家
     *      district		string	区
     *      province		string	省
     *      street		string	街道
     *      street_number		string	街道号
     *  location		object
     *      lat		string	纬度
     *      lng		string
     */
    openLocation(successBack,errorBack){

        if(1==11){
            successBack({
                address: {
                    city: "杭州",
                    country: "",
                    district: "",
                    province: "浙江省",
                    street: "",
                    street_number:"",
                }, location: {
                    lat: "30.25924446",
                    lng: "120.21937542"
                }
            });
            return ;
        }
        if(this.location&&successBack){
            successBack(this.location);
            return ;
        }
        this.getLocation((p)=>{
            var sb = (code, message, json, option) => {
                if(this.location){
                    return;
                }
                this.location = json;
                //alert("IP详情信息:"+JSON.stringify(json));
                successBack(json);
            };
            var eb = (code, message) => {
                if(this.location){
                    return;
                }
                //alert("IP详情错误:"+JSON.stringify())
                errorBack({code:code, message:message});
            };
            HttpTool.post(APILXF.api_common_gitCityName, sb
                , eb,p);
            //不停的请求 这是个BUG
            setTimeout(()=>{
                if(this.location){
                    return;
                }
                HttpTool.post(APILXF.api_common_gitCityName, sb
                    , eb,p);
            },1000)
        },(e)=>{
            errorBack(e);
        });
        // this.runGetLocation()
        //     .then((p) => {
        //         //alert("定位:"+JSON.stringify(p));
        //         return p;
        //     }, (e) => {
        //         //alert("定位错误:"+JSON.stringify(e));
        //         return null;
        //     })
        //     .then((p) => {
        //         alert(3);
        //         //alert("获取定位结果 P:"+p);
        //         var sb = (code, message, json, option) => {
        //             if(this.location){
        //                 return;
        //             }
        //             this.location = json;
        //             //alert("IP详情信息:"+JSON.stringify(json));
        //             successBack(json);
        //         };
        //         var eb = (code, message) => {
        //             if(this.location){
        //                 return;
        //             }
        //             //alert("IP详情错误:"+JSON.stringify())
        //             errorBack({code:code, message:message});
        //         };
        //             HttpTool.post(APILXF.api_common_gitCityName, sb
        //             , eb,p);
        //              //不停的请求 这是个BUG
        //             setTimeout(()=>{
        //                 if(this.location){
        //                     return;
        //                 }
        //                 HttpTool.post(APILXF.api_common_gitCityName, sb
        //                     , eb,p);
        //             },1000)
        //     })
        //     .catch((e) => {
        //         //alert("崩了:"+JSON.stringify(e));
        //         errorBack({code:-1, message:"定位错误"});
        //
        //     });


    },

    getLocation(resolve,reject){
        try {
            if(window.plus){
                plus.geolocation.getCurrentPosition(  ( position )=> {
                    var p = {lat:position.coords.latitude,lng:position.coords.longitude}
                    // 去IP定位
                    resolve(p);
                }, (e)=> {
                    //用户拒绝,或没有得到 进行IP定位
                    resolve();
                    // reject({code:-1, message:"手机定位失败"})
                } );
            }

            // else if (navigator.geolocation){
            //     navigator.geolocation.getCurrentPosition((position)=>{
            //         var p ={lat:position.coords.latitude,lng:position.coords.longitude}
            //         //去IP定位
            //         resolve(p);
            //     },(error)=>{
            //         resolve();
            //         // reject({code:-2, message:"WEB定位失败"})
            //     });
            // }

            else{
                //没得定位,去IP定位
                resolve();
                // reject({code:-3, message:"无支持定位功能"})
            }
        }catch (e){
            reject({code:-1, message:"定位失败"})
        }

    },
    runGetLocation(){

        return new Promise((resolve, reject)=>{
            //做一些异步操作
            //alert("开始定位");
        alert(22);
            setTimeout(()=>{
                if(window.plus){
                    alert(23);
                    plus.geolocation.getCurrentPosition(  ( position )=> {
                        var p = {lat:position.coords.latitude,lng:position.coords.longitude}
                        // 去IP定位
                        resolve(p);
                    }, (e)=> {
                        //用户拒绝,或没有得到 进行IP定位
                        reject({code:-1, message:"手机定位失败"})
                    } );
                }else if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition((position)=>{
                        var p ={lat:position.coords.latitude,lng:position.coords.longitude}
                        //去IP定位
                        resolve(p);
                    },(error)=>{
                        reject({code:-2, message:"WEB定位失败"})
                    });
                }else{
                    //没得定位,去IP定位
                    reject({code:-3, message:"无支持定位功能"})
                }
            }, 2000);

        });
    },

    runGetIpInfo(p){
        return new Promise((resolve, reject) => {
            //做一些异步操作
            //alert("开始IP获取详情");
            HttpTool.post(APILXF.api_common_gitCityName, (code, message, json, option) => {
                    resolve(json)
                }
                , (code, message) => {
                    reject({code: code, message: message})
                }, p)

        });
    }
}
