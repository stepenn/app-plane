/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import Toast from '../../../component/Toast/index';
import Loading from '../../../component/Dialog/Loading/index'
import HelpI from '../../../help/Help.js';
import HttpHelp from '../../../http/HttpTool';
import COOKIE from '../../../tool/CookieHelp';
import CONFIG from '../social.conf';
import css from './Friends.less'
import ListItem from '../ListItem';

class page extends Component {

	constructor(props){
		super(props);
		this.Help = new HelpI();
		COOKIE.getUserInfo();
		this.userInfo = COOKIE.userinfo;
		this.state = {
			// verList: [
			// 	{
			// 		avatar:'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		msg: 'xxxxsadfasdfasdfasdfsdf我我我我我我我',
			// 		nickName: 'targetNickName',
			// 		userId: 'targetId1'
			// 	},{
			// 		avatar:'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		msg: 'Please Add Me asdfasd',
			// 		nickName: 'targetNickName1',
			// 		userId: 'targetId2'
			// 	}
			// ],
			verList: [],
			warnText: ''
		}
	}
	componentDidMount() {
		Loading.show(true);
		this.fetchVeriList();
		this.sendVerifyListRead();
		Loading.show(false);
		this.Help.setIntent('refresh');
	}
	componentWillUnmount() {
		this.Help.close(this);
	}
	fetchVeriList() {
		let payload = {
			userId: this.userInfo.id
		};
		HttpHelp.post(CONFIG.ADDRESSapi.getVeriFriendList.url,
			(a, b, c) => {
				let res = c, result = res.map((val, i) => {
					return {
						avatar: val.avatar,
						msg: val.apply_msg,
						nickName: val.nick_name,
						userId: val.id
					}
				});
				res.length > 0 ? this.setState({ verList: result }) :
					this.setState({
						warnText: CONFIG.ADDRESSapi.getVeriFriendList.defaultText
					})
				}, // success
			(a, b) => this.setState({
						warnText: b
					}), // error
			payload
		)
	}
	agreeAddFriend(e) {
		e.preventDefault();
		let paramArr = ['idx', 'cb'],
			obj = this.getEventParams(paramArr, ...[].splice.call(arguments, 1, paramArr.length)),
			targetId = this.state.verList[obj['idx']].userId;
		// obj['cb']();
		// alert('agree add')
		this.sendReq(targetId, 1, obj['cb']); // TODO: request api
	}
	rejectAddFriend(e) {
		e.preventDefault();
		let paramArr = ['idx', 'cb'],
			obj = this.getEventParams(paramArr, ...[].splice.call(arguments, 1, paramArr.length)),
			targetId = this.state.verList[obj['idx']].userId;
		// obj['cb']();
		// alert(targetId);
		this.sendReq(targetId, 0, obj['cb']); // TODO: request api
	}
	sendReq(targetId, isAgree ,cb) {
		// make request body accroding to verify list
		let payload = {
			agreed: isAgree,
			friendId: targetId
		}
		HttpHelp.post(CONFIG.ADDRESSapi.sendVerify.url,
			(code,msg) => { Toast.showToast(msg),cb() }, // success
			(code,msg) => { Toast.showToast(msg) }, // error
			payload
		)
	}
	sendVerifyListRead() {
		HttpHelp.post(CONFIG.ADDRESSapi.setVerifyListRead.url,
			() => { }, // success
			() => { } // error
		);
	}
	getEventParams(paramArr) {
		let args = [].slice.call(arguments, 1), result = {};
		paramArr.forEach((val, i) => {
			result[val] = args[i];
		})
		return result;
	}
	showProfile(e, msgBody) {
		this.Help.app_open(this, '/PersonDetail', {
			title: msgBody.nickName,
			friendId: msgBody.userId,
			friendFrom: 3 // TODO: need to decided
		})
	}
	render() {
		let { verList }=this.state, listViewArr = verList.length>0 ? verList.map((val, i) => {
			let tempListItemProp = {
				messageBody: {
					userId: val.userId,
					avatar: val.avatar,
					nickName: val.nickName,
					message: '验证消息:' + val.msg,
				},
				options: {
					type: 0,
					payload: {
						buttons: [
							{
								text: '忽略',
								event: (e,i,cb) => this.rejectAddFriend(e,i,cb)
							},
							{
								text: '同意',
								event: (e,i,cb) => this.agreeAddFriend(e,i,cb)
							}
						],
						text: '已忽略,已接受'
					},
					showInfo: {
						event: (e, body) => this.showProfile(e, body)
					}
				}
			}
			return <ListItem key={i} {...tempListItemProp} position={i}/>
		}) : <div className={css.contact_errText}>
				<div className={css.contact_errText__text}>{this.state.warnText}</div>
			</div>
		var div = (
			<ScrollView className={css.main}>

				{listViewArr}

			</ScrollView>
		);
		return this.Help.app_render(this,div);
	}
}
page.contextTypes = {
	router: React.PropTypes.object
}
module.exports = page;