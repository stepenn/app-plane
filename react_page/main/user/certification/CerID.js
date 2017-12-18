/**
 * Created by apin on 2017/6/8.
 */
import React, {Component} from 'react';
import HelpI from '../../../help/Help.js';
import css from './CerID.less';
import ScrollDivV from '../../../component/ScrollDiv/ScrollDivCom.js';
import HttpTool from '../../../http/HttpTool.js';
import APIGYW from '../../../http/APIGYW.js';
import Toast from '../../../component/Toast/index.js';
import CookieHelp from '../../../tool/CookieHelp.js';
import GetPhone from '../../public/GetPhone.js'
import Loading from '../../../component/Dialog/Loading/index.js';
import SelectAlert from '../../../component/Dialog/Select/index.js'

class page extends Component {
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.frontImg = "";
        this.backImg = "";
        this.cerImg = "";
        this.param = this.Help.app_getParameter(this).param;
        this.img_idFront ='/serverImg/id_front.png';
        this.img_idBack =  '/serverImg/id_back.png';
        this.img_add = window.imgHost + '/images/img_addId.png';
        this.img_submit = window.imgHost + '/images/submit_btn.png';
        this.state = {
            upData:0,
        }
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    upView(){
        this.setState({
            upData:this.state.upData+1,
        })
    }
    render() {
        var div = (<ScrollDivV className={css.main}>
            <div className={css.title}>身份证照片</div>
            <div className={css.bg} onClick={()=>{
                this.PhotoAlbum(1);
            }}>
                <img className={css.idFrontBg} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_idFront)
                }} src={this.frontImg}/>
                {/*<div className={css.idFrontBg}></div>*/}
                <div className={this.frontImg == "" ? css.addImg : css.hidden} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_add)
                }}></div>
                <div className={this.frontImg==""?css.addTitle:css.hidden}>上传身份证正面照</div>


                {/*<div className={css.frame}>*/}
                    {/*<div className={css.loadCenter}>*/}
                        {/*<div className={css.ballBeat}/>*/}
                        {/*<div className={css.ballBeat2}/>*/}
                        {/*<div className={css.ballBeat3}/>*/}
                    {/*</div>*/}
                {/*</div>*/}

            </div>

            <div className={css.bg} onClick={()=>{
                this.PhotoAlbum(2);
            }}>
                <img className={css.idbackBg} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_idBack)
                }} src={this.backImg}/>
                {/*<div className={css.idbackBg}></div>*/}
                <div className={this.backImg == "" ? css.addImg : css.hidden} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_add)
                }}></div>
                <div className={this.backImg==""?css.addTitle:css.hidden}>上传身份证反面照</div>
            </div>

            <div className={css.row}>
                <div className={css.left}>1</div>
                <div className={css.right}>请按照示例图提交身份证正反面照片</div>
            </div>
            <div className={css.row}>
                <div className={css.left}>2</div>
                <div className={css.right}>照片要四角对齐，如有模糊,反光，太暗,有遮挡则不予认证。</div>
            </div>

            <div className={css.title}>添加电子导游证</div>
            <div className={css.bg} onClick={()=>{
                this.PhotoAlbum(3);
            }}>
                <img className={css.cerImgBg} src={this.cerImg}/>
                <div className={this.cerImg == "" ? css.addImg : css.hidden} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_add)
                }}></div>
                <div className={this.cerImg==""?css.addTitle:css.hidden}>上传电子导游证</div>
            </div>

            <div className={css.submit} style={{
                backgroundImage: this.Help.getImgUrl(this.img_submit)
            }}
                 onClick={()=>{
                     this.submit();
                 }}>立即申请</div>
        </ScrollDivV>);
        return this.Help.app_render(this,div);
    }

    PhotoAlbum(type){
        GetPhone.openSelect(
            {
                savePath:"selectImg/",
            }, (url)=>{
                switch (type)
                {
                    case 1:{
                        this.frontImg = url;
                        this.upView();
                    }
                        break;
                    case 2:{
                        this.backImg = url;
                        this.upView();
                    }
                        break;
                    case 3:{
                        this.cerImg = url;
                        this.upView();
                    }
                        break;
                    default:
                        break;
                }
                this.url = url;

            }, (failCall)=>{

            })
    }
    submit() {
        if (this.frontImg.length<1){
            Toast.showToast("请上传身份证正面照");
            return;
        }
        if (this.backImg.length<1){
            Toast.showToast("请上传身份证反面照");
            return;
        }
        if (this.cerImg.length<1){
            Toast.showToast("请上传电子导游证");
            return;
        }
        var param=this.param;
        param["idcard_front_img"] = this.frontImg;
        param["idcard_back_img"] = this.backImg;
        param["leader_card_img"] = this.cerImg;

        // var param=this.param;
        // param["idcard_front_img"] = "http://or3vlc7sj.bkt.clouom/20170609/55afab804ce411e78f4f2342a1e04737.jpg";
        // param["idcard_back_img"] = "http://or3vlc7sj.bkt.clouddn.com/20170609/59697f304ce411e78f4f2342a1e04737.jpg";
        // param["leader_card_img"] = "http://or3vlc7sj.bkt.clouddn.com/20170609/5e9580804ce411e78f4f2342a1e04737.jpg";
        Loading.show(true);
        var successCallback = (code, message, json,option)=> {
            Loading.show(false,()=>{
                var userInfo = CookieHelp.getUserInfo();
                userInfo.status = json.status;
                CookieHelp.saveUserInfo(userInfo);
                SelectAlert.open((yes)=>{
                    this.selectYes = yes;
                },{
                    title:"温馨提示",
                    content:"您已提交领队审核,3个工作日内给出结果,请注意查看...",
                    quit:"取消",
                    sure:"关闭",
                    isShow:false,
                },()=>{
                    //关闭之后
                    this.Help.setIntent(true);
                    this.Help.back(this);
                });
            })
        };
        var failCallback = (code, message,option)=> {
            Loading.show(false,()=>{
                Toast.showToast(message);
            })
        };
        HttpTool.post(APIGYW.api_leader_addLeader, successCallback, failCallback,param);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;