import React, {Component} from 'react';
import css from './ShareWhere.less';
import HelpI from '../../../help/Help.js';
import ShareHelp from '../../../main/plus/ShareHelp';
import Toast from '../../../component/Toast/index.js';
class ShareWhere extends Component {
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.isShareVisible = this.isShareVisible.bind(this);
        this.share = [
            {img:window.imgHost + ('/images/img_wechat.png'),txt:'微信',click:this.ShareWeChat.bind(this)},
            {img:window.imgHost + ('/images/img_WXfriends.png'),txt:'朋友圈',click:this.ShareWeChatFriends.bind(this)},
            {img:window.imgHost + ('/images/img_weibo.png'),txt:'微博',click:this.ShareSinaWeiBo.bind(this) },
            {img:window.imgHost + ('/images/img_qq.png'),txt:'QQ',click:this.ShareTencentQQ.bind(this)},
        ]
        this.state={
            active:false
        }
        this.img_board = window.imgHost + '/images/bg_board.png';
        this.open = this.open.bind(this)
    }
    ShareWeChat(){
        ShareHelp.openShare(this.props.success, this.props.error, this.props.options, 'weixin')
    }
    ShareWeChatFriends(){
      ShareHelp.openShare(this.props.success, this.props.error, this.props.options, 'weixinquan')
    }
    ShareSinaWeiBo(){
      ShareHelp.openShare(this.props.success, this.props.error, this.props.options, 'sinaweibo')
    }
    ShareTencentQQ(){
      ShareHelp.openShare(this.props.success, this.props.error, this.props.options, 'qq')
    }
    isShareVisible(){
        this.setState({
            active:!this.state.active
        })
      if (typeof this.props.cancel === 'function') {
            this.props.cancel()
      }
    }

    open() {
        this.setState({
          active: true,
        })
    }
    render(){
        return(
            <div>
                <div className={`${css.ShareBox} ${this.state.active && css.ShareVisiblity}`} style={{
                    backgroundImage: this.Help.getImgUrl(this.img_board)
                }}>
                    分享到
                    <div className={css.container}>
                        <div className={css.weChatBox}>
                            {
                                this.share.map((item,i)=>{
                                    return (
                                        <div className={css.shareTo} key={i} onClick={()=>{

                                            item.click()
                                        }}>
                                            <img className={css.shareImg} src={item.img} />
                                            <p className={css.shareTxt}>{item.txt}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={css.cancel} onClick={
                            this.isShareVisible
                        }>取消</div>
                    </div>

                </div>
                <div onClick={
                  this.isShareVisible
                }>
                  {this.props.children}
                </div>
                <div className={`${css.ShareMask} ${!this.state.active&&css.show}`} onClick={
                    this.isShareVisible}></div>
            </div>
        )
    }
}
ShareWhere.contextTypes={
    router:React.PropTypes.object
}
module.exports = ShareWhere;