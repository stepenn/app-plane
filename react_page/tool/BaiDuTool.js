/**
 * Created by lixifeng on 17/4/12.
 */
//百度地图API功能
import Config from '../Config.js';
//百度地图API功能
window.loadBaDuJScript = (callBack) => {

    if(!window.getBaiDuMap){
        window.getBaiDuMap = [];
    }
    window.getBaiDuMap.push(callBack)

    if(window.loadBaDuJScriptState){
        window.initBaiDuEnd();
        return;
    }
    //下载百度JS
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak="+Config.getBaiDuKey()+"&callback=initBaiDuEnd";
    document.body.appendChild(script);

}
window.initBaiDuEnd = () => {
    if (window.getBaiDuMap) {
        //当前调用的 仅生效当前
        for(let i in window.getBaiDuMap){
            window.getBaiDuMap[i]();
        }
        //清空当前的记录/ 只生效一次
        window.getBaiDuMap = null;
    }
    window.loadBaDuJScriptState = true;
}