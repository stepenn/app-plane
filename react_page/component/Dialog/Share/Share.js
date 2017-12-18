/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './Share.less';
import HelpI from '../../../help/Help.js';
import ShareHelp from '../../../main/plus/ShareHelp';
import Toast from '../../../component/Toast/index.js';
import ClickHelp from '../../../tool/ClickHelp.js';
import HttpTool from '../../../http/HttpTool.js';
import APISP from '../../../http/APISP.js';
class ShareWhere extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        //QQ/WECHAR(微信朋友圈)/WEUSER(微信朋友)/WEIBO
        this.share = [
            {
                img: window.imgHost + ('/images/img_wechat.png'),
                txt: '微信',
                type: "WEUSER"
            },
            {
                img: window.imgHost + ('/images/img_WXfriends.png'),
                txt: '朋友圈',
                type: "WECHAR",
            },
            {
                img: window.imgHost + ('/images/img_weibo.png'),
                txt: '微博',
                type: "WEIBO",
            },
            {
                img: window.imgHost + ('/images/img_qq.png'),
                txt: 'QQ',
                type: "QQ",
            },
        ]
        this.img_board = window.imgHost + '/images/bg_board.png';
    }


    close() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }


    toServer(type){
        // content		string
        // title		string
        // type		string	QQ/WECHAR(微信朋友圈)/WEUSER(微信朋友)/WEIBO
        // url
        var param =this.props.option;
        if(!param){
            return;
        }
        param.type = type;

        var successCallback = (code, message, json, option) => {
        };
        var failCallback = (code, message) => {
        };
        HttpTool.post(APISP.api_common_recodeShare, successCallback, failCallback, param);
    }
    render() {
        return (
            <div className={css.bg}
                 onClick={(e) => {
                     this.close();
                     ClickHelp.stopClick(e);
                 }}
            >
                <div
                    className={css.ShareBox} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_board)
                }}>
                    <div >
                        <div className={css.title}>分享到</div>
                        <div className={css.container}>
                            <div className={css.weChatBox}>
                                {
                                    this.share.map((item, i) => {
                                        return (
                                            <div className={css.shareTo} key={i} onClick={(e) => {

                                                ShareHelp.openShare((info)=>{
                                                    try{
                                                        this.toServer(item.type);
                                                    }catch (e){

                                                    }
                                                    if (this.props.callBack) {
                                                        this.props.callBack(true,info);
                                                    }
                                                    this.close();

                                                }, (e)=>{
                                                    if(e&&(e.code==-999991||e.code==-999992)){
                                                        Toast.showToast(e.message);
                                                    }

                                                    if (this.props.callBack) {
                                                        this.props.callBack(false,e);
                                                    }
                                                }, this.props.option, item.type)
                                                ClickHelp.stopClick(e);
                                            }}>
                                                <img className={css.shareImg} src={item.img}/>
                                                <p className={css.shareTxt}>{item.txt}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={css.cancel} onClick={
                                (e)=>{
                                    this.close();
                                    ClickHelp.stopClick(e);
                                }

                            }>取消
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = ShareWhere;