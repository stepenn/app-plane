//更新APP
function checkUpdate(wgtVer,proBack,msgBack,finishBack){
    msgBack("当前版本号:"+wgtVer);
    var checkUrl=window.ApinDomain+"/updateWeb";
    // checkUrl = "http://10.0.0.89:3000/testapi";
    // checkUrl = "http://demo.dcloud.net.cn/test/xhr/json.php"
    // checkUrl = "http://apis.map.qq.com/ws/place/v1/search"
    var xhr = new plus.net.XMLHttpRequest();
    xhr.onreadystatechange=function(){
        switch(xhr.readyState){
            case 4:
                if(xhr.status==200){
                    var info=xhr.responseText;
                    var obj = null;
                    try{
                        //     vcode: "999",版本号
                        //         isIncrement: 0,是否增量
                        //         url: "http://10.0.0.89:3000/upData/apin.wgt",下载地址
                        //         code: 1 是否成功
                        obj =   JSON.parse(info);
                    }catch (e){
                        obj = {};
                    }
                    var newVer = obj.vcode;
                    msgBack("资源版本号:"+newVer);
                    if(obj.code==1&&isMax(wgtVer,newVer)==1){
                        downWgt(obj.url,proBack,msgBack,finishBack);  // 下载升级包
                    }else{
                        msgBack("已是最新版本");
                        finishBack();
                    }
                }else{
                    msgBack("检测更新失败！");
                    finishBack();
                }
                break;
            default:
                break;
        }
    }
    xhr.timeout=30000;  // 设置极小的超时时间用于处罚ontimeout事件
    xhr.ontimeout = function(){
        // xhr请求超时事件处理
        finishBack();
    };
    xhr.open( "GET", checkUrl );
    // 发送HTTP请求
    xhr.send();
}

function isMax(a, b) {
    var aa = a.split('.')
    var bb = b.split('.')
    for (var i = 0; i < aa.length && i < bb.length; i++) {
        if (aa[i] < bb[i]) return 1
        else if (aa[i] > bb[i]) return -1
    }
    return 0
}
// 下载wgt文件

function downWgt(url,proBack,msgBack,finishBack){
    var options = {method:"GET"};
    var dtask = plus.downloader.createDownload( url, options );
    dtask.addEventListener( "statechanged", function(task,status){
        if(!dtask){return;}
        switch(task.state) {
            case 1: // 开始
                msgBack( "开始提取..." );
                break;
            case 2: // 已连接到服务器
                msgBack( "发现资源..." );
                break;
            case 3:	// 已接收到数据

                var persent = (Math.ceil((task.downloadedSize/task.totalSize)*100))
                if(persent>=100){
                    persent = 100;
                }
                proBack(persent);
                break;
            case 4:	// 下载完成
                msgBack( "提取完成,开始装载！" );
                installWgt(task.filename,proBack,msgBack,finishBack); // 安装wgt包
                break;
            default:

        }
    },false );
    dtask.start();
}
// 更新应用资源
function installWgt(path,proBack,msgBack,finishBack){
    plus.runtime.install(path,{},function(){
        msgBack("装载成功！");
        finishBack(true);
    },function(e){
        msgBack("装载资源失败["+e.code+"]："+e.message);
        finishBack();
    });
}