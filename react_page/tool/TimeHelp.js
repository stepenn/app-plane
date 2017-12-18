/**
 * Created by lixifeng on 16/11/4.
 */
let TimeHelp = {

    /**
     *
     * @param time 10位时间
     * @returns {string} 返回 2016/12/12
     */
    getYMDFormat(time,format){
        var newDate = new Date();
        if(time&&String(time).length<11){
            newDate.setTime(time*1000);
        }else{
            newDate.setTime(time);
        }

        var showtime = this.format(newDate,format);
        return showtime;
    },
    getYMD(time){
        return this.getYMDFormat(time,"yyyy-MM-dd",);
    },
    getLineYMD(time){
        return this.getYMDFormat(time,"yyyy/MM/dd",);
    },
    getYMDHMS(time){
        return this.getYMDFormat(time,"yyyy-MM-dd hh:mm:ss",);
    },
    getYMDHM(time){
        return this.getYMDFormat(time,"yyyy-MM-dd hh:mm",);
    },
    getMD(time){
        return this.getYMDFormat(time,"MM-dd",);
    },
    getHM(time){
        return this.getYMDFormat(time,"hh:mm",);
    },
    getD(time){
        return this.getYMDFormat(time,"dd",);
    },
    getH(time){
        return this.getYMDFormat(time,"hh",);
    },

    getWeek(date){
        // var year=date.getFullYear();
        // var month=gw_now_addzero(date.getMonth()+1);
        // var day=gw_now_addzero(date.getDate());
        // var hour=gw_now_addzero(date.getHours());
        // var minute=gw_now_addzero(date.getMinutes());
        // var second=gw_now_addzero(date.getSeconds());
        if (!date){
            return "";
        }
        var newDate = new Date();
        newDate.setTime(date);
        var week = "";
        switch (newDate.getDay()) {
            case 0:week="日";break
            case 1:week="一";break
            case 2:week="二";break
            case 3:week="三";break
            case 4:week="四";break
            case 5:week="五";break
            case 6:week="六";break
            default:week = "";break
        }
        return week;
    },
    gw_now_addzero(temp){
        if(temp<10) return "0" + temp;
        else return temp;
    },

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    format(date,fmt)
    { //author: meizz
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}
module.exports = TimeHelp;