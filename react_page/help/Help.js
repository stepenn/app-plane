/**
 * Created by lixifeng on 17/5/22.
 */

import React, { Component } from 'react';
import css from './Help.less';
import PageAnim from '../anim/PageAnim.js';
import Config from '../Config.js';
import ClickHelp from '../tool/ClickHelp.js';
import crypto from 'crypto';
/**O
 * 得到参数
 * @param obj
 * @returns {{}}
 */

class help {

	constructor() {
		this.search = this.getUrlSearch(window.location.href);
		this.img_bar = (window.imgHost + "/images/img_bar.png");
		this.img_back = (window.imgHost + "/images/img_back.png");
		this.img_wenhao = (window.imgHost + "/images/wenhao.png");

		this.img_bgYellow = window.imgHost + "/images/bg_yellow.jpg";
		this.bd_top = window.imgHost + '/images/bd_top.png';
		this.bd_left = window.imgHost + "/images/bd_left.png";
		this.bd_right = window.imgHost + "/images/bd_right.png";
		this.setPageAnimOption({ type: "right" });
	}
	app_getParameter(obj) {
		if (this.stateP) {
			return this.stateP;
		}

		//非SPA应用,并在手机中
		if (this.isApp()) {
			if (this.search) {
				this.stateP = JSON.parse(plus.storage.getItem(this.search.key));
				return this.stateP;
			} else {
				return {};
			}
		} else {
			if (obj && obj.props && obj.props.location && obj.props.location.state) {
				this.stateP = obj.props.location.state
				return this.stateP;
			} else {
				return {};
			}

		}


	}
	/**
	 * 打开页面
	 * @param obj
	 * @param path
	 * @param state
	 * @param callBack
	 */
	app_open(obj, path, state, callBack) {
		if (obj && obj.context && obj.context.router && obj.context.router.push) {
			if (path == "/") {
				//主页
			} else {
				var pathname = "";
				if (obj.context.router.location) {
					pathname = obj.context.router.location.pathname;
				}

                path = pathname+path;
                path = path.replace("//","/");
            }
            if(this.isApp()){
                var host = window.location.origin;
                if(host.toLowerCase().indexOf("http")!=0){
                    //不是以http开头
                    host = "";
                }
                //生成唯一 KEY
                var info = path+this.randomString(5)+new Date().getTime().toString();
                var key = crypto.createHash('md5').update(info).digest("hex");

                //存在参数,进行传递
                if(state){
                    plus.storage.setItem(key, JSON.stringify(state));
                }


                //告诉下个页面,当前参数的KEY
                //页面的地址
               var url = host+ "/testC.html?key="+key+"&r=1#"+path;
                // var w = plus.webview.create(url);
                var w =plus.webview.create(url, '', {top:'0px',bottom:'0px',});
//获取当前窗口
//                 var ws = plus.webview.currentWebview();
                //监听当前侧滑窗口的右滑
                // w.drag({
                //     direction: 'right',
                //     moveMode: 'followFinger'
                // }, {
                //     view: plus.runtime.appid,
                //     moveMode: 'silent'
                // }, function(e) {
                //     //滑动到end执行mui.back()事件
                //     if(e.type == 'end' && e.result) {
                //         // alert("end");
                //     }
                // });
                //打开页面
                // 侧滑返回后关闭webview
                if(state&&state.callBack){
                    w.onclose = ()=>{
                        // alert("页面关闭");
                        var cb = plus.storage.getItem(key+"_callBack");
                        if(cb){
                            state.callBack(JSON.parse(cb));
                        }

                    }
                }

                plus.webview.show( w, 'slide-in-right', 300, ()=>{
                    // alert("打开成功");
                    // w.evalJS('var testValue = 102;testEnter(testValue)');
                });; // 显示窗口
                // 在Android5以上设备，如果默认没有开启硬件加速，则强制设置开启


			} else {
				obj.context.router.push(
					{
						pathname: path,
						state: state
					})
			}

		} else {
			if (callBack) {
				callBack("打开页面错误,请检查");
			} else {
				alert("打开页面错误,请检查");
				log(obj);
			}
		}

	}

	app_children(obj) {
		if (!obj.props.children) {
			return null;
		}

		return (
			<div className={css.contentFull}>
				{obj.props.children}
			</div>
		);
	}

	app_render(obj, div, option) {



		//定位最大区域显示
		div = <div className={css.contentFull}>{div}</div>

		var borderView = null;
		if (option && option.noBorder) {
			//不显示边框
			borderView = null;
		} else {
			// borderView = (
			//     <div className={css.contentBorder}/>
			// );

			borderView = (
				<div className="">
					<div className={css.contentBorderTop}
						style={{ backgroundImage: this.getImgUrl(this.bd_top) }} />
					<div className={css.contentBorderBottom}
						style={{ backgroundImage: this.getImgUrl(this.bd_top) }} />
					<div className={css.contentBorderLeft}
						style={{ backgroundImage: this.getImgUrl(this.bd_left) }} />
					<div className={css.contentBorderRight}
						style={{ backgroundImage: this.getImgUrl(this.bd_right) }} />
				</div>
			);
		}
		var bgView = null;
		if (option && option.noBg) {
			bgView = null
		} else {
			if (option && option.bg == "type1") {
				bgView = (
					<div className={css.contentBG_yellow}
						style={{ backgroundImage: this.getImgUrl(this.img_bgYellow) }} />
				);
			} else {
				//默认
				bgView = (
					<div className={css.contentBG_yellow}
						style={{ backgroundImage: this.getImgUrl(this.img_bgYellow) }} />
				);
			}

		}

		if (option && option.full) {
			//如果显示全屏
			var main = (
				<div className={css.contentWhite}>
					{bgView}
					{div}
					{borderView}
					{this.app_children(obj)}
				</div>
			);
			return this.getRender(obj, main);
		} else {
			//如果声明导航视图,启动,否者启用默认
			var barView = null;
			if (option && option.barView) {
				barView = option.barView;
			} else {
				var actionView = null;
				if (option && option.actionView) {
					actionView = option.actionView;
				} else {
					// actionView = <img src={this.img_wenhao} className={css.bar_action} onClick={()=>{
					//     if(obj.action){
					//       obj.action();
					//     }
					//   }}/>
				}
				barView = (
					<div
						style={{
							backgroundImage: this.getImgUrl(this.img_bar)
						}}
						className={css.bar_bg}>
						<div
							style={{
								backgroundImage: this.getImgUrl(this.img_back)
							}}
							className={css.bar_back}
                            {...ClickHelp.onClick(()=>{
								this.back(obj)
							})}
						></div>
						<div className={css.bar_title}>{this.app_getParameter(obj).title}</div>
						{actionView}

                    </div>
                );
            }
            var main = (
                <div className={css.contentFull}>
                    <div
                        className={css.contentBarView}
                    >
                        {barView}
                    </div>
                    <div className={css.contentBarWhite}>
                        {bgView}
                        {div}
                        {borderView}
                    </div>

                    {this.app_children(obj)}
                </div>
            );

            return this.getRender(obj, main);
        }


    }

    getRender(obj,main){

        window.onHardwareBack = ()=>{
            try{
                this.back(obj)
            }catch (e){

            }finally {

            }

        }
        //如果在手机中,并不是SPA应用
        if(this.isApp()){
            return main;
        }
        if(this.pageAnimOption){
            return  (
                <PageAnim
                    option={this.pageAnimOption}
                    action={(action)=>{
                        this.pageAnimAction = action;
                        {/*action.setShowView(main);*/}
                    }}
                    callBack={(type)=>{
                        if(type){
                            //页面动画加载完成

                            if(obj.animEnter){
                                obj.animEnter();
                            }
                        }else{
                            log("页面返回了");
                            if(obj.animEnd){
                                obj.animEnd();
                            }
                            //页面关闭完成
                            this.backPage(obj);
                        }

                    }}
                >
                    {main}
                </PageAnim>
            );
        }else{
            if(!obj.animEnterExe){
                obj.animEnterExe = true;
                setTimeout(()=>{
                    if(obj.animEnter){
                        obj.animEnter();
                    }
                },500)
            }

            return main;
        }
    }

    getBorderView(){
        //显示边框

    }
    setPageAnimOption(pageAnimOption){
        this.pageAnimOption = pageAnimOption;
    }
    isApp(){
        return !Config.ISSAP&&window.plus;
    }

    setIntent(option){
        if(this.isApp()){
            plus.storage.setItem(this.search.key+"_callBack", JSON.stringify(option));
        }else{
            this.resultOption = option;
        }

    }
    back(obj) {
        if(this.isApp()){
            this.backPage(obj);
        }else
        if (obj && obj.context && obj.context.router && obj.context.router.goBack) {
            //如果存在动画.关闭动画
            if(this.pageAnimOption){
                if(this.pageAnimAction){
                    this.pageAnimAction.setShowView(false);
                }else{
                    this.backPage(obj);
                }
            }else{
                log("说好的返回呢2")
                this.backPage(obj);
            }


        } else {
            log(obj);
        }

    }

    close(obj){
        if(this.app_getParameter(obj).callBack&&this.resultOption){
            this.app_getParameter(obj).callBack(this.resultOption);
            log("有返回数据");
        }else {
            log("无返回数据");
        }
    }
    backPage(obj){

        if(this.isApp()){
            var ws=plus.webview.currentWebview();
            plus.webview.close(ws);
        }else{
            obj.context.router.goBack();
        }

    }


    getUrlSearch(str) {
        var query = {};
        var name, value;
        var num = str.indexOf("?")
        if (num < 0) {
            return query;
        }

        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        var arr = str.split("&"); //各个参数放到数组里

        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                query[name] = value;
            }
        }
        return query;
    }
    getImgUrl(url) {
        if(url){
            return `url(${url})`;
        }else{
            return null;
        }

    }


    randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
}

module.exports = help;
