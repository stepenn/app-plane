/**
 * Created by lixifeng on 17/3/24.
 */
import React, { Component } from 'react';
let JRoll = require('jroll');
let JRollPulldown = require('../jroll_pulldown');

import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import Toast from '../../../component/Toast/index';
import css from '../message/Message.less';
import HelpI from '../../../help/Help.js';
import TimeHelp from '../../../tool/TimeHelp';
import COOKIE from '../../../tool/CookieHelp';
import HttpHelp from '../../../http/HttpTool';
import CONFIG from '../social.conf';

class page extends Component {

	constructor(props){
		super(props);
		this.Help = new HelpI();
		this.img_bar = (window.imgHost + '/images/img_bar.png');
		this.img_back = (window.imgHost + "/images/img_back.png");
		this.img_userInfo = (window.imgHost + '/images/img_profile.png')
		this.img_tick = (window.imgHost + '/images/img_tick.png');
		this.bg_sender = (window.imgHost + '/images/bg_yellow.jpg');
		let targetId = this.Help.app_getParameter(this)['friendId']; // TODO: transfer
		COOKIE.getUserInfo();
		this.userInfo = COOKIE.userinfo;
		this.getTargetUserInfo(targetId);
		// let tmp = {
		// 		messageType: 'service',
		// 		messageBody: {
		// 			nickName: 'user2', unreadCount: 0, userId: 'local',
		// 			avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
		// 			message: 'Heleo', time: '1495508437119'
		// 		}
		// }
		this.state = {
			msg: '',
			transY:0,
			targetId: targetId,
			userId: this.userInfo.id,
			userAvatarUrl: this.userInfo.avatar,
			msgList: []
		}
		this.targetAvatarUrl = '';
		this.pullDepth = CONFIG.IMapi.getMsgHis.pullDepth;
		this.chatList = null;
		this.pageY = 0;
		this.isFirst = true; // after first time load messages scroll to bottom
		this.isStartedScroll = false;
		this.step = 0;
	}
	componentDidMount() {
		this.configureSocket(); // configure socket
		// window.addEventListener('touchmove', this._touchMoveEvent)
		// this.chatList.addEventListener('touchmove', this._touchMoveEvent);
		// this.chatList.addEventListener('touchstart', this._touchStartEvent);
		// this.chatList.addEventListener('touchend', this._touchEndEvent);
	}
	componentDidUpdate() {
		// this.scrollToBottom();
		// window.scrollChatList = this.chatList;
	}
	componentWillUnmount() {
		this.socket.close();
		this.Help.close(this);
	}
	configureSocket() {
		let self = this, socketOptions = {
			reconnectionDelay: 5000
		}, i = 0;
		this.socket = io.connect(window.socketUrl + CONFIG.socket.params + this.userInfo.ukey, socketOptions);
		this.socket.on(CONFIG.socket.recvSocketEvent.recvMsg.eventName, (data) => (this.pushMsg(data)));
		this.socket.on(CONFIG.socket.recvSocketEvent.recvRsp.eventName, (data) => (this.sendSafe(data),this.scrollToBottom()));
		this.socket.on('error', (e) => Toast.showToast(e));
		this.socket.on('reconnect_attempt', () => { ++i,i > 3 && Toast.showToast('网络连接不畅！') });
		this.socket.on('reconnect_failed', () => { Toast.showToast('请检查网络连接！') });
	}
	touchStartEvent(e) {
		if (this.chatList.scrollTop == 0) {
			// alert(1)
			this.pageY = (e.touches[0].pageY)
			// log('OOoooOooOooooOOOO' + this.pageY);
		}
	}
	touchMoveEvent(e) {
		// log('touch.pageY'+e.touches[0].pageY);
		if (this.chatList.scrollTop == 0 && this.pageY === 0) {
			// alert(2)
			this.pageY = (e.touches[0].pageY)
			// console.error('xxxxxxxxxx' + this.pageY)
		}
		var distance = (Math.max(e.touches[0].pageY - this.pageY, 0))/1.5;
		// console.warn('tranY' + distance);
		// console.warn(distance)
		if (this.chatList.scrollTop == 0 || this.isStartedScroll) {
			this.isStartedScroll = true;
			this.step = distance > this.pullDepth ? 2 : 1;
			this.setState({
				transY: distance > this.pullDepth ? this.pullDepth : distance
			})
		}
		if (this.state.transY == 0) {
			this.isStartedScroll = false;
		}
	}
	touchEndEvent(e) {
		if (this.state.transY == this.pullDepth) {
			// alert(3);
			this.step = 0
			this.fetchHistory()
		}
		this.setState({
			transY: 0
		})
	}
	/**
	 * deal the data received from server
	 * @param {*socket data body} data 
	 */
	pushMsg(data) {
		let tmpMsg = {
			messageType: ('' + data.fromId === '' + this.state.userId) ? 'user' : 'service',
			messageBody: {
				msgid: '',
				msgStat: 1,
				nickName: this.state.targetNickname,
				avatar: this.targetAvatarUrl,
				message: data.msg,
				time: data.time,
				
			}
		};
		this.setState((preState) => {
			return {
				msgList: preState.msgList.concat(tmpMsg)
			}
		}, () => {
			this.scrollToBottom(); // after set state complete scroll to bottom automatically
		})
	}
	/**
	 * get target user avatar
	 * @param {* target user id} targetUserId 
	 */
	getTargetUserInfo(targetUserId) {
		let payload = { user_id: targetUserId };
		HttpHelp.post(CONFIG.INFOapi.getTargetUserInfo.url,
			(a, b, c) => { let res = c; this.targetAvatarUrl=res.avatar; this.fetchHistory(); }, // success
			(code, msg) => { }, // error
			payload
		)
	}
	/**
	 * create random string for local image identify
	 */
	createRandomId() {
		return (~~(Math.random() * Math.pow(2, 31))).toString(36);
	}
	/**
	 * get oldest time when message list is empty return 0
	 */
	getOldestTime() {
		let { msgList } = this.state;
		return msgList.length > 0 ? msgList[0].messageBody.time : 0;
	}
	/**
	 * fetch message history
	 */
	fetchHistory() {
		let { targetId,msgList } = this.state, {pageCount,pageInitCount }=CONFIG.IMapi.getMsgHis, self = this, payload = {
			chatUserId: this.state.targetId,
			pageCount: msgList.length > 0 ? pageCount : pageInitCount,
			time: this.getOldestTime(),
			userId: this.state.userId
		}
		HttpHelp.post(CONFIG.IMapi.getMsgHis.url,
			(a,b,c)=>self.updateStateTree(a,b,c), // success
			(code,msg) => { Toast.showToast(msg) }, // error
			payload
		)
	}
	/**
	 * Update state
	 * @param {* return code} code 
	 * @param {* request message} msg 
	 * @param {* request body} json 
	 */
	updateStateTree(code,msg,json) {
		// get history message
		if (json.length === 0) {
			Toast.showToast(CONFIG.IMapi.getMsgHis.defaultText);
			return;
		}
		let res = json, { targetId, userId, userAvatarUrl } = this.state, self = this,
			result = res.map((val, i) => {
				let isSelf = val.fromid === self.userInfo.id, tmpMsg = {
					messageType: isSelf ? 'user' : 'service',
					messageBody: {
						nickName: isSelf ? userId : targetId,
						avatar: isSelf ? userAvatarUrl : this.targetAvatarUrl,
						time: val.msg_time,
						unreadCount: val.readed,
						message: val.msg,
						msgId: '',
						type: val.type
					}
				}
				return tmpMsg;
			});
		// add time section
		let timeSplitter = {
			messageType: 'system',
			messageBody: {
				message: res[0].msg_time,
				time: res[0].msg_time
			}
		}
		result.unshift(timeSplitter);
		this.setState((preState) => {
			return {
				msgList: result.concat(preState.msgList)
			}
		}, () => {
			this.isFirst ? (this.isFirst = false, this.scrollToBottom()) : void 0;
		})
	}
	handleInput(e) {
		this.setState({msg:e.target.value})
	}
	handleKeyDown(e) {
		if (e.keyCode === 13 && e.ctrlKey) {
			this.handleSubmit(e);
		}
	}
	handleSubmit(e) {
		e.preventDefault();
		let { msg, targetId, userId, userAvatarUrl } = this.state,
			tmpMsg = {
				messageType: 'user',
				messageBody: {
					msgId: this.createRandomId(),
					msgStat: 1,
					nickName: this.userInfo.nickName,
					avatar: userAvatarUrl,
					message: msg,
					time: +new Date()
				}
			},
			payload = {
				type: CONFIG.socket.sendSocketEvent.type,
				fromId: userId,
				toId: targetId,
				msgid: tmpMsg.messageBody.msgId,
				msg: msg
			};
		msg !== '' ? (
			this.socket.emit(CONFIG.socket.sendSocketEvent.eventName, payload),
			this.setState((preState) => {
			return {
				msg: '',
				msgList: preState.msgList.concat(tmpMsg)
				}
			})) : void 0;
	}
	/**
	 * resend message body
	 * @param {* event} e 
	 * @param {* resend message} msgBody 
	 */
	handleResend(e,msgBody) {
		let { targetId, userId, userAvatarUrl } = this.state, payload = {
			type: 0, // 0: text
			fromId: userId,
			toId: targetId,
			msgid: msgBody.msgId,
			msg: msgBody.message
		};
		this.socket.emit(CONFIG.socket.sendSocketEvent.eventName, payload);
	}
	/**
	 * check message send successful
	 * @param {* data received from server} data 
	 */
	sendSafe(res) {
		let { code, data } = res, self=this, result = setMsgStat(code);
		function setMsgStat(stat) {
			return (self.state.msgList.reduce((pre, cur) => {
				let tmp = cur;
				return pre.concat((tmp.messageBody.msgId == data.msgid) ? (tmp.messageBody.msgStat = stat, tmp) : tmp);
			// alert(cur.msgId == data.msgid);
			// return pre.concat(cur)
			}, []))
		}
		this.setState(() => { 
			return {
				msgList: result
			};
		})
	}
	scrollToBottom() {
		let d = document, h = d.querySelector('#chatroom'), l = d.querySelector('#chatscroll'), // get scroll div (l) and top div (h) elements
			ch = l ? l.clientHeight : 0, sh = l ? l.scrollHeight : 0;
		l ? l.scrollTop = sh - ch : void 0;
	}
	/**
	 * Jump to view target user profile
	 */
	navigateToProfile() {
		let { targetId } = this.state, nickName = this.Help.app_getParameter(this)['title'];
		this.Help.app_open(this, '/PersonDetail', { title: nickName, friendId: targetId })
	}
	render() {
		// log('-----------' + this.state.transY);
		let { msgList, msg } = this.state, time = this.getOldestTime(),
			chatArrView = msgList.map((val, i) => <Section key={i} message={val} resendEvent={(e, msgBody) => this.handleResend(e, msgBody)} ></Section>),
			div = (
			// <ScrollView style={{width:"100%",height:"100%"}}>
			<div>
				{/*<header className='chatroom-head'>
					<div className="chatroom-head_white">
						<span className="chatroom-head_room" >Chat Room</span>
						<span className="chatroom-head_user">
							<span id="userName">{this.props.userInfo.inputName}</span> {"|"}
							<span className='chatroom-head_logout'>Logout</span>
						</span>
					</div>
				</header>*/}
				<div className={css.message_container}>
				
					{/*<div id="chatroom" className={css.message}>*/}
						{/*<div id="onlinecount" className='message-online_count'>Heleo from hex</div>*/}
						{/*<div>*/}
						{/*<ScrollView className={css.message_content}>*/}
							<PullBlock step={this.step} transY={this.state.transY}></PullBlock>
							<div id='chatscroll' ref={(a) => { this.chatList = a }} className={css.message_content__scroll} onTouchStart={e => this.touchStartEvent(e)}
							onTouchMove={e => this.touchMoveEvent(e)} onTouchEnd={e=>this.touchEndEvent(e)}
								style={{transform:`translateY(${this.state.transY}px)`}}>
								{/*<div className={css.message_headline}>{TimeHelp.format(new Date(parseInt(time)),'MM-dd hh:mm')}</div>*/}
									{chatArrView}
							</div>
							{/*</ScrollView>*/}
						{/*</div>*/}
					{/*</div>*/}
				</div>
				<div className={css.message_sender} style={{
					backgroundImage:`url(${this.bg_sender})`
				}}>
					<div className={css.message_sender__input}>
						<input type="text" name="content" id="content"
							onKeyDown={(e) => this.handleKeyDown(e)}
							onChange={(e) => this.handleInput(e)} value={msg} />
					</div>
					<div className={css.message_sender__action}>
							{msg !== '' ?
								<div className={css.message_sender__send} style={{ backgroundImage: `url(${this.img_tick})` }}
										onClick={(e) => this.handleSubmit(e)}></div> :
										null}
							{/*{msg !== '' ?
									<button id='sendBtn' style={{ backgroundImage: `url(${this.img_tick})` }}
										onClick={(e) => this.handleSubmit(e)}></button> :
										null}*/}
					</div>
				</div>
			</div>
			// </ScrollView>	
		),title = this.Help.app_getParameter(this)['title'], barView = (
			<div
				style={{
					backgroundImage: "url(" + this.img_bar + ")"
				}}
				className={css.bar_bg}>
				<div
					style={{
						backgroundImage: "url(" + this.img_back + ")"
					}}
					className={css.bar_back}
					onClick={() => {
						this.Help.back(this)
					}}
				></div>
				<div className={css.bar_title}>{title}</div>
				<div className={css.bar_userInfo} onClick={() => {
					this.navigateToProfile();
				}}>
					<img src={this.img_userInfo} alt=""/>
				</div>
			</div>
		);
		return this.Help.app_render(this, div, { barView: barView });
		// return div;
	}
}
class Section extends Component{
	constructor(props) {
		super(props);
		this.bgAvatarRing = window.imgHost + ('/images/bg_head_ring.png');
		this.img_err = window.imgHost + ('/images/icon_logo.png');
		this.state = {
			src: props.message.messageBody.avatar?props.message.messageBody.avatar:this.img_err
		}
		// this.src = null;
		// this.src = props.message.messageBody.avatar;
	}
	componentWillReceiveProps(nextProps) {
		let avatar = nextProps.message.messageBody.avatar;
		this.setState({
			src: (avatar && avatar !== '') ? avatar : this.img_err
		})
	}
	handleImage() {
		this.setState({
			src: this.img_err
		})
	}
	render() {
		let { message, resendEvent } = this.props,
			msgInfo = <div className={css.message_info}>{message.messageBody.info}</div>;
		// console.log(message.messageBody.message+'===='+message.messageType + ': ' + this.state.loadStat);
		// log(message.messageBody.avatar)
		return (
			<section className={css[message.messageType]}>
				<span>
					<div className={css.msglist_avatar__ring} style={{
						backgroundImage: `url(${this.bgAvatarRing})`
					}}></div>
					<img src={this.state.src} onError={() => {
							this.handleImage()
						}} alt=""/>
				</span>
				<div className={(message.messageBody.msgStat===0) ? css.message_sender__resend : css.message_sender__resendHide}
					onClick={(e) => resendEvent(e, message.messageBody)} // resend event
				>!</div>
				<div className={css.message_info}>{message.messageType=='system'?TimeHelp.format(new Date(parseInt(message.messageBody.message)),'MM-dd hh:mm') : message.messageBody.message}</div>
			</section>
		)
	}
}
class PullBlock extends Component{
	constructor(props) {
		super(props);
		this.state = {
			listContents: [
				{
					text:'下拉加载更多'
				}, {
					text:'松手开始获取'
				}, {
					text:'刷新中'
				}
			]
		}
	}
	render() {
		return (
			<section className={css.pulldown_block} style={{
				transform:`translateY(${this.props.transY}px)`
			}}>
				<ul>
					{this.state.listContents.map((val, i) => <li key={i} style={{
						display: this.props.step == ++i ? 'block' : 'none'
					}}>{val.text}</li>)}
				</ul>
			</section>
		)
	}
}

page.contextTypes = {
	router: React.PropTypes.object
}
module.exports = page;