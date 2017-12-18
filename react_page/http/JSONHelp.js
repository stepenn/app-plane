/**
 * Created by lixifeng on 16/8/1.
 */

/**
 * Created by lixifeng on 16/8/1.
 */
let JSONHelp = {
    printJson(json) {
        var sb = "";
        sb += "{\r\n";
        sb += this.FormatJSON("",json);
        sb += "\r\n}";
        return sb;
    },
    FormatJSON(up,json) {
        var sb = "";
        var count = 0;
        for (key in json){
            count=count+1;
        }
        var index = 0;
        for (key in json){

            var last = (index==(count-1));
            var first = (index==0);
            var value = json[key];
            if(value){
                //存在值
                if(typeof value === 'object'){
                    sb+=  up+"\""+key+"\":"+"{\r\n";
                    sb += this.FormatJSON(up+"   ",value);
                    sb +=  "\r\n"+up+"}"+(last?"":",")+"\r\n";
                }else{
                    sb += up+"\""+key+"\":\""+value+"\""+(last?"":",\r\n")+ "";
                }
            }else{
                //只有键
                sb+= up+"\""+key+"\":\"NULL\""+(last?"":",\r\n")+ "";
            }
            index=index+1;
        }
        return sb;
    },
}

export default JSONHelp;