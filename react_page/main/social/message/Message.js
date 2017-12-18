/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import css from './Message.less';
import HelpI from '../../../help/Help.js';
import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import Loading from '../../../component/Dialog/Loading/index';
import Toast from '../../../component/Toast/index'
import TimeHelp from '../../../tool/TimeHelp';
import COOKIE from '../../../tool/CookieHelp';
import HttpHelper from '../../../http/HttpTool';
import CONFIG from '../social.conf';

class page extends Component {
	constructor(props) {
		super(props);
		this.Help = new HelpI();
		this.Help.setPageAnimOption(null);

        COOKIE.getUserInfo();
		this.userInfo = COOKIE.userinfo ? COOKIE.userinfo : {};
		this.state = {
			messageList: []
			// messageList: [{
			// 		messageType: 'user',
			// 		messageBody: {
			// 			nickName: 'cda35e6ece08', unreadCount: 2, userId: '9276d0f0-41f6-11e7-b4df-29056f3e4847',tempUserId: 'local',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495608437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }, {
			// 		messageType: 'service',
			// 		messageBody: {
			// 			nickName: '2bcc735ccfb0', unreadCount: 0, userId: '613f9d20-4208-11e7-a17e-2bcc735ccfb0',tempUserId: 'target',
			// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 			message: 'Heleo', time: '1495508437119'
			// 		}
			// }]
		};
	}
    callback(select) {
        //被选择
        if(select){
			let self = this;
			HttpHelper.post(CONFIG.IMapi.getList.url,
				(a,b,c)=>self.updateMsgTree(a,b,c), // success
				(code, msg) => self.showToast(msg), // fail
				);
        }
    }
	componentDidMount() {
        if (this.props.selectCall) {
            this.props.selectCall(this.callback.bind(this));
        }
	}
	updateMsgTree(code, message, json) {
		let res = json, result, self = this, isSelf = false;
		(code === 1 && res.length > 0) ? result = res.map((val, i) => {
			return (isSelf = val.fromId==self.userInfo.id),{
				messageType: isSelf? 'user' :'service',
				messageBody: { // message owner
					// type: 0, // 0，文字，1，图片，2，表情，3，语音
					nickName: val.nick_name,
					time: val.msgTime,
					message: val.msg,
					avatar: val.avatar,
					unreadCount: val.readed,
					userId: val.fromid
				}
			}
		}) : result = [];
		self.setState({messageList:result})
	}
	showToast(msg) {
		Toast.showToast(msg);
	}
	pushNewMsg(data) {
		let tmpMsg = {
			messageType: data.from.nickname === this.userInfo.id ? 'user' : 'service',
			messageBody: {
				nickName: data.from.nickname,
				userId: data.from.userid,
				avatar: data.from.avatar,
				message: data.message,
				time: data.time
			}
		};
		this.setState((preState) => {
			return {
				messageList:preState.messageList.unshift(tmpmsg)
			}
		})
	}

	render() {
		let { messageList} = this.state,
			msgList = messageList.length > 0 ? messageList.map((val, i) => {
				return (
					<Item val={val} key={i} position={i} userInfo={this.userInfo}></Item>
				)
			}) : <div className={css.emptyMsg} dangerouslySetInnerHTML={{__html:CONFIG.IMapi.getList.defaultText}}></div>, div = (
			<ScrollView className={`${css.main} ${css.main_topMargin}`}>
					<div className={css.main_edge__bottom}>
						{/*<div onClick={() => { this.setState }}>Button</div>*/}
						{msgList}
					</div>
			</ScrollView>
		);
		return div;
	}
}

class Item extends Component{
	constructor(props) {
		super(props);
		this.Help = new HelpI();
		// this.bgAvatarRing = require('./../images/bg_head_ring.png');
		// this.img_err = require('../images/img_err.png');
		this.bgAvatarRing = window.imgHost + '/images/bg_head_ring.png';
		this.img_err = window.imgHost + '/images/icon_logo.png';
		this.state = {
			count: 1,
			imgStat: 1
		}
	}
	handleItemClick(e) {
		e.preventDefault();
		let { val, userInfo } = this.props;
		val.messageBody.unreadCount = 1;
		this.setMsgRead();
		this.setState({
			count: this.state.count + 1,
			imgStat: 1
		})
		this.Help.app_open(this, "/MessageInfo", {
			title: val.messageBody.nickName,
			friendId: val.messageBody.userId,
			// lastMsg: val
		});
	}
	// TODO: before route to room, set infos to read
	setMsgRead() {
		let { val } = this.props, payload = {
			chatUserId: val.messageBody.userId
		};
		HttpHelper.post(CONFIG.IMapi.setRead.url,
			() => { }, // success
			() => { }, // error
			payload);
	}
	handleIMG(code) {
		this.setState({
			imgStat: code
		})
	}
	render() {
		let { val, position } = this.props, imgSrc = this.state.imgStat ? val.messageBody.avatar : this.img_err,
			formatString = TimeHelp.format(new Date(parseInt(val.messageBody.time)), 'yyyyMMdd')
						=== TimeHelp.format(new Date(), 'yyyyMMdd')?'hh:mm':'MM-dd hh:mm';
		return (
			<div className={`${css.msglist_item} ${position == 0 ? css.msglist_item__first : null}`}
				onClick={(e) => this.handleItemClick(e)}>
					<div className={css.msglist_avatar}>
						<div className={css.msglist_avatar__main}>
							<div className={css.msglist_avatar__ring} style={{
								backgroundImage: `url(${this.bgAvatarRing})`
							}}>
							</div>
							<img src={imgSrc} onError={() => {
								this.handleIMG(0)
							}} />
						</div>
					</div>
					<div className={css.msglist_content}>
						<span className={css.msglist_name}>{val.messageBody.nickName}</span>
						<span className={css.msglist_body}>{val.messageBody.message}</span>
					</div>
					<div className={css.msglist_end}>
						{val.messageBody.unreadCount==0 ? <div className={css.msglist_end__unread}></div> : void 0}
						<div className={css.msglist_end__time} >{TimeHelp.format(new Date(parseInt(val.messageBody.time)),formatString)}</div>
					</div>
					<div className={css.msglist_del}>删除</div>
				</div>
		)
	}
}

page.contextTypes = {
	router: React.PropTypes.object
}
Item.contextTypes = {
	router: React.PropTypes.object
}
module.exports = page;