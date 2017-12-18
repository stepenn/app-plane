import React, { Component } from 'react';
import HelpI from '../../../help/Help.js';
import css from './Siege.less';
import ScrollView from  '../../../component/ScrollDiv/ScrollDivCom.js';
import ImageUpLayout from  '../../public/ImageUpLayout/index';
import Button from  '../../public/Button/index';
import APIGYW from '../../../http/APIGYW.js';
import HttpTool from '../../../http/HttpTool.js';
import Loading from '../../../component/Dialog/Loading/index.js';
import Toast from '../../../component/Toast/index.js';
import ClickHelp from '../../../tool/ClickHelp.js';

class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state ={}
        this.postValue = this.Help.app_getParameter(this).postValue;
        this.route_id = this.Help.app_getParameter(this).route_id;

        this.img_input = window.imgHost + '/images/img_input.png';
        this.img_board = window.imgHost + '/images/bg_board.png';
    }
    componentWillUnmount(){
        this.Help.close(this);
        ClickHelp.hiddenKey();
    }

    render(){
        var div =(
            <ScrollView className={css.main}>
                <div className={css.title}>航行日志</div>
                <div className={css.siegeText} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_input)
                }}>
                    <input
                        ref="title"
                        className={css.txtArea}
                        placeholder="请填写航行日志"
                        defaultValue={this.postValue.title}>
                    </input>
                </div>
                <div className={css.title}>规则介绍</div>

                <div className={css.rulesText} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_board)
                }}>
                    <textarea
                        ref="content"
                        className={css.textCon}
                        defaultValue={this.postValue.memo}
                        placeholder="请填写规则介绍">
                    </textarea>
                </div>

                <div className={css.title}>图片</div>
                <div className={css.imageLayout}>
                    <ImageUpLayout
                        option={{width:480,quality:30}}
                        url={this.postValue.images?JSON.parse(this.postValue.images):null}
                        obj={(obj)=>{
                            this.imageUpLayout = obj;
                        }}
                    />
                </div>

                <Button className={css.strikeS}
                        {...ClickHelp.onClick(()=>{
                            var url = this.imageUpLayout.getUrl();
                            log(url);
                            var postView = {
                                images:JSON.stringify(url),
                                title:this.refs.title.value,
                                memo:this.refs.content.value,
                            }

                            if (this.route_id){
                                this.submit(postView);
                            }else {
                                this.Help.setIntent(postView);
                                this.Help.back(this);
                            }
                        })}
                >{this.route_id?"确定":"确定"}</Button>
            </ScrollView>
        )
        return this.Help.app_render(this,div,{title:false});
    }
    submit(postView){
        if (!this.route_id){
            Toast.showToast("行程id不存在");
            return;
        }
        postView.route_id = this.route_id;
        Loading.show(true);
        //参数
        var successCallback = (code, message, json, option) => {
            Loading.show(false,()=>{
                Toast.showToast(message);
                this.Help.setIntent(postView);
                this.Help.back(this);
            });
        };
        var failCallback = (code, message) => {
            Loading.show(false,()=>{
                Toast.showToast(message)
            });
        };
        HttpTool.post(APIGYW.api_route_editRouteLog, successCallback, failCallback, postView);
    }
}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
