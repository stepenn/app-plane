/**
 * Created by apin on 2017/6/17.
 */
let CheckInstallApk = {
    /**
     *
     * @param phone {string}手机号
     * @returns {bool} 返回 true or false
     */
    checkInstallApk(pkgname) {
        if (!window.plus){
            return false;
        }
        if (this.isMobile()==1){
            plus.android.importClass('java.util.ArrayList');
            plus.android.importClass('android.content.pm.PackageInfo');
            plus.android.importClass('android.content.pm.PackageManager');
            var MainActivity = plus.android.runtimeMainActivity();
            var PackageManager = MainActivity.getPackageManager();
            var pinfo = plus.android.invoke(PackageManager, 'getInstalledPackages', 0)
            if (pinfo != null) {
                for (var i = 0; i < pinfo.size(); i++) {
                    //PackageInfo{4b45699f9d  com.tencent.mobileqq}
                    if (pinfo.get(i).toString().indexOf(pkgname) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        }else {
            return true;
        }
    },
    isMobile(){
        var u = navigator.userAgent, app = navigator.appVersion;
        if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
            if(window.location.href.indexOf("?mobile")<0){
                try{
                    if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
                        return '0';
                    }else{
                        return '1';
                    }
                }catch(e){}
            }
        }else if( u.indexOf('iPad') > -1){
            return '0';
        }else{
            return '1';
        }
    },
}
module.exports = CheckInstallApk;
