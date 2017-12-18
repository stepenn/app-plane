/**
 * Created by lixifeng on 16/11/4.
 */
let ClickHelp = {

    /**
     *
     * @param e 事件源 (e)=>{}
     */
    stopClick(e){
        try {
            e.nativeEvent.stopImmediatePropagation()
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true
        } catch (error) {
        }

    },

    onClick(fun){
        var exeClick = () => {
            if (fun) {
                fun()
            }
        }
        var isPc  = this.IsPC();
        var click = {
            onClick: (e) => {
                if(isPc){
                    exeClick(e);
                }

            },
            onTouchEnd: (e) => {
                //document.activeElement.blur();

                if (isPc){
                    return true;
                }

                try {
                    //如果是手机.不执行
                    var inputs = document.getElementsByTagName("INPUT")
                    for (let i = 0; i < inputs.length; i++) {
                        inputs[i].blur();
                    }
                    e.nativeEvent.stopImmediatePropagation()
                    e.stopPropagation();
                    e.preventDefault();
                    e.cancelBubble = true
                } catch (error) {
                }

                exeClick(e);
                return false;

                // this.clickLogin();
            }
        }
        return click;
    },
    hiddenKey(){
        try {
            var inputs = document.getElementsByTagName("INPUT")
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].blur();
            }
        } catch (error) {
        }
    },
    IsPC() {

        var userAgentInfo = navigator.userAgent.toLowerCase();

        var uc = "";
        try {
            uc = navigator.xUcbrowserUa+navigator['x-ucbrowser-ua'];
        }catch (e){

        }
        userAgentInfo =userAgentInfo+uc;

        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v].toLowerCase()) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

}
module.exports = ClickHelp;