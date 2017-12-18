//底部下载条
var bottomdiv = document.createElement("div");
var btn = document.createElement("button");
btn.innerText = "安装应用";
var xbtn = document.createElement("span");
xbtn.innerText = "×";
var textdiv = document.createElement("div");
// <img src='static/logo.png'/> 
var logo= document.createElement("img");
logo.src="/images/apinlog.png"
textdiv.innerHTML = "<span style='font-size:14px'>爱拼机-境外团飞利器</span><br><span style='font-weight:normal;font-size:12px;line-height:28px;'>团飞就上爱拼机</span>";

var body = document.getElementsByTagName("body")[0];
bottomdiv.appendChild(xbtn);
bottomdiv.appendChild(logo);
bottomdiv.appendChild(textdiv);
bottomdiv.appendChild(btn);
body.appendChild(bottomdiv);
body.style.cssText = "margin:0"

bottomdiv.style.cssText = "height:80px;width:100%;background-color:rgba(0,0,0,0.5);padding:0px;border-radius:4px;position:fixed;z-index:999;bottom:0";
btn.style.cssText = "position:absolute;height:50%;top:25%;right:15px;color:#fff;background-color:#007ACC;border-radius:5px;outline:0;border:0;padding:0 15px;";
// xbtn.style.cssText = "font-size:26px;background-color:transparent;color:#fff;padding:0px 5px;border:0px solid #fff;width:20px;height:20px;line-height:20px;text-align:center"
xbtn.style.cssText = "font-size:26px;background-color:transparent;color:#fff;padding:0px 5px;width:20px;height:20px;line-height:20px;text-align:center;position:absolute;top:37.5%;"
// textdiv.style.cssText = "color:#fff;font-weight:bold;margin-left:20%;text-align:left;position:absolute;right:0px;display:inline-block;line-height:25px;margin-top:13px"
textdiv.style.cssText = "height:60%;top:20%;color:#fff;font-weight:bold;text-align:left;position:absolute;left:26%;"
logo.style.cssText="position:absolute;height:50%;top:25%;left:10%"
xbtn.onclick = function() {
    bottomdiv.style.display = "none";
    var timer = setInterval(function() {
        if (bottomdiv.style.display == "none") {
            bottomdiv.style.display = "block"
            clearInterval(timer)
        }
    }, 50000)
}

var ua = navigator.userAgent;
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    isAndroid = ua.match(/(Android)\s+([\d.]+)/),
    isMobile = isIphone || isAndroid;

btn.onclick = function() {
    if (isMobile) {
        window.location.href="/app/down/download.html"
        // window.location.href = "/download.html"
    } else {
        window.location.href="/app/down/pc-download.html"
        // window.location.href = "/pc-download.html"
    }

}