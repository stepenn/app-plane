/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import Input from '../../../component/Dialog/Input/index';
import Toast from '../../../component/Toast/index';
import Loading from '../../../component/Dialog/Loading/index';
import css from './Friends.less';
import HelpI from '../../../help/Help.js';
import HttpHelp from '../../../http/HttpTool';
import ContactsHelp from '../../plus/ContactsHelp'
import COOKIE from '../../../tool/CookieHelp'
import CONFIG from '../social.conf';
import ListItem from '../ListItem'

class page extends Component {
	constructor(props){
		super(props);
		this.Help = new HelpI();
		this.Help.setPageAnimOption(null);
		COOKIE.getUserInfo();
		this.userInfo = COOKIE.userinfo;
		this.phoneRegExp = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/;
		// this.phoneRegExp = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/, 'i'); // not support below android 6
		// quick filter phone number through reduce (pre,cur)=>return pre.concat(cur.phone.map...
		// regex.test(val)
		this.state = {
			getLocal: false,
			errText: '',
			friendList:[]
            // friendList: [
				// {
            //         nickName:"葛艳威",
            //         avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
            //         name: 'targetNickName',
            //         mobile:'18888888888',
            //         userId: 'targetId',
            //         isFriend: true,
				// }, {
            //         nickName:"葛艳威",
            //         avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
            //         name: 'targetNickName',
            //         mobile:'18888888888',
            //         userId: 'targetId',
            //         isFriend: true,
				// }
            // ]
		};
	}
	// without this function async step will end after render
	animEnter() {
		// setTimeout(() => this.getLocalContact(), 100);
	}
	componentDidMount() {
		setTimeout(() => this.getLocalContact(), 100);
		// alert('Done'+new Date())
	}
	compoenntWillUnmount() {
		this.Help.close(this);
	}
	getLocalContact() {
		let self = this;
		ContactsHelp.getList((data) => {
			let tmpContacts = data.reduce((pre, cur) =>
					pre.concat(cur.phones.map((val, i) => {
						return { name: cur.name, phone: val.replace(/\s/g,'') }
				})), []);
			tmpContacts = tmpContacts.filter((val) => !!val.phone.match(self.phoneRegExp))
			self.reqContactList(tmpContacts);
		}, (e) => { this.setState({ getLocal: true, errText: e.message }) })
	}
	// get contact from phone
	reqContactList(phoneList) {
		let payload = {
			phoneList: JSON.stringify(phoneList)
		}, self = this;
		HttpHelp.post(
			CONFIG.ADDRESSapi.checkListAdded.url,
			(code, msg, json) => self.filterContactList(code, msg, json), // success
			(code, msg) => { this.setState({getLocal: true,errText: msg}) }, // error
			payload
		);
	}
	filterContactList(code, msg, json) {
		let res = json, errText = '', result = (res.length > 0) ? (res.map((val, i) => {
			return {
				avatar: val.avatar,
				userId: val.id,
				mobile: val.mobile,
				isFriend: !!val.isFriend,
				nickName: val.nick_name,
				name: val.name
			}
		})) : (errText = CONFIG.ADDRESSapi.checkListAdded.defaultText, []);
		this.setState({
			friendList: result,
			errText: errText,
			getLocal: true
		})
	}
	sendAddReq(e) {
		let args = [].slice.call(arguments, 1), idx = args[0],
			friend=this.state.friendList[idx], cb = args[args.length - 1];
		Input.open((v) => {
			v !== '' ? (this.sendAddRequest(friend, v, cb)) :
				Toast.showToast(CONFIG.ADDRESSapi.addFriend.defaultText);
		}, { max: 100 });
	}
	/**
	 * send request to server
	 * @param {*} friendInfo all known friend infomation
	 * @param {*} msg request message content
	 * @param {*} cb callback function
	 */
	sendAddRequest(friendInfo,msg,cb) {
		let payload = {
			friendFrom: 1,
			friendId: friendInfo.userId,
			friendMobile: '',
			msg: msg,
			userId: this.userInfo.id
		}, self = this;
		// Test block
		// setTimeout(function() {
		// 	self.sendRqSuccess(1, '已发送请求！', ''), cb();
		// }, 500);
		// alert(JSON.stringify(payload))
		HttpHelp.post(
			CONFIG.ADDRESSapi.addFriend.url,
			(code, msg, json) => { Toast.showToast(msg),cb() },
			(code,msg) => Toast.showToast(msg),
			payload
		)
	}
	showProfile(e, msgBody, cb) {
		// alert(JSON.stringify(msgBody));
		// set callback to check wheather add friend request is sent
		this.Help.app_open(this, '/PersonDetail', {
			title: msgBody.nickName,
			friendId: msgBody.userId,
			friendFrom: 1,
			callBack: (obj) => obj === 1 ? cb('已发送') : void 0
		})
	}
	render() {
			// Loading.show(!this.state.getLocal);
			let { friendList,getLocal } = this.state, arrView = friendList.length > 0 ? friendList.map((val, i) => {
				// alert(JSON.stringify(val))
				let tmpListItemProp = {
					messageBody: {
						nickName: val.nickName,
						unreadCount: val.unreadCount ? val.unreadCount : 0,
						userId: val.userId,
						message: '手机联系人:'+val.name,
						avatar: val.avatar,
					},
					options: {
						type: val.isFriend ? 1 : 0, // 0.Button, 1.Text
						payload: {
							buttons: [{
								text: '添加',
								event: (e, i, cb) => this.sendAddReq(e, i, cb)
							}],
							text: val.isFriend ? '已添加' : '已发送'
						},
						showInfo: {
							event: (e, msgBody, cb) => this.showProfile(e, msgBody, cb)
						}
					}
				}
				return (
					<ListItem key={i} {...tmpListItemProp} position={i}>
					</ListItem>)
			}) : <div className={css.contact_errText}>
					<div className={css.contact_errText__text}>{this.state.errText}</div>
				</div>,
			overlayView = <div className={`${css.telephone_overlay} ${!getLocal ? css.fade_in:''}`}>
					<div className={css.telephone_overlay__text}>{CONFIG.ADDRESSapi.getFriendsList.overlayText}</div>
				</div>,
			viewScreen = (
				<div>
					{!getLocal ? overlayView : null}
					{/*{overlayView}*/}
					<ScrollView className={css.main}>
						{arrView}
					</ScrollView>
				</div>
		);
		return this.Help.app_render(this, viewScreen);
	}
}
page.contextTypes = {
	router: React.PropTypes.object
}
module.exports = page;