
//爱拼机,插件配置
function exe_plugin_apinapi(){
    var addPlugin = function () {
        var _BARCODE = 'apinapi',
            B = window.plus.bridge;
        var MyPL =
            {

                exe: function (type,param, successCallback, errorCallback) {
                    // alert("type:"+type);
                    var success = typeof successCallback !== 'function' ? null : function (args) {
                            successCallback(args);
                        },
                        fail = typeof errorCallback !== 'function' ? null : function (code) {
                            errorCallback(code);
                        };
                    var  callbackID = B.callbackId(success, fail);
                    //判断 原生壳 是否集成指定插件

                    window.plus.runtime.getProperty( plus.runtime.appid, function ( wgtinfo ) {
                        //appid属性
                        var wgtStr =wgtinfo.features;
                        for(var i in wgtStr){
                            if(wgtStr[i].toLocaleLowerCase() == _BARCODE.toLocaleLowerCase()){
                                // alert("执行原生");
                                return B.exec(_BARCODE, "exe", [callbackID, type,JSON.stringify(param)]);
                            }
                        }
                        errorCallback({code:-2,message:"爱拼机:未安装"+_BARCODE+"插件"});
                    } );
                },

            };
        window.plus.apinapi = MyPL;
    }

    window.apinapi = function (type,param,callBack,error) {
        if(window.plus){
            addPlugin();
            if(window.plus.apinapi){
                window.plus.apinapi.exe(type,param,callBack,error);
            }else{
                error({code:-1,message:"请桥接apinapi插件"});
            }
        }else{
            error({code:-1,message:"请在APP中打开 或 检查 plusready 是否就绪"});
        }
    };

}
exe_plugin_apinapi();