/**
 * Created by apin on 2017/6/13.
 */
let VerHelp = {
    /**
     *
     * @param phone {string}手机号
     * @returns {bool} 返回 true or false
     */
    getPhone(phone){
        if (!phone||phone.length<1){
            return false;
        }
        var isMobile = (/^1[34578]\d{9}$/.test(phone));
        if (isMobile){
            return true;
        }else {
            return false;
        }
    },
    getTel(tel){
        if (!tel||tel.length<1){
            return false;
        }
        var isTel = (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(tel));
        if (isTel){
            return true;
        }else {
            return false;
        }
    },
}
module.exports = VerHelp;