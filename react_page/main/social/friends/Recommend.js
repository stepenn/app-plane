/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import Loading from '../../../component/Dialog/Loading/index';
import Toast from '../../../component/Toast/index';
import HelpI from '../../../help/Help.js';
import css from './Friends.less'
import ListItem from '../ListItem'
import HttpHelp from '../../../http/HttpTool';
import COOKIE from '../../../tool/CookieHelp'
import CONFIG from '../social.conf';
import Input from '../../../component/Dialog/Input/index';

class page extends Component {

	constructor(props){
		super(props);
		this.Help = new HelpI();
		COOKIE.getUserInfo();
		this.userInfo = COOKIE.userinfo;
		this.state = {
			warnText: '',
			// friendList: [
			// 	{
			// 		avatar:'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'JustAFun',
			// 		userId: 'targetId'
			// 	},{
			// 		avatar:'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'JustBfun',
			// 		userId: 'targetId'
		// 	}
		// ]
		friendList:[]
		}
	}
	componentDidMount() {
		Loading.show(true);
		this.reqRecmdFriendList(this.userInfo.id);
		Loading.show(false);
	}
	componentWillUnmount() {
		this.Help.close(this);
	}
	/**
	 * request recommand friend list
	 * @param {*local userId} userId 
	 */
	reqRecmdFriendList(userId) {
		let payload = {
			userId: userId
		}, { url } = CONFIG.ADDRESSapi.getRecommandFriendsList,self = this;
		HttpHelp.post(url,
			(code, msg, json) => { self.updateRecmdFriendTree(json) },
			(code, msg) => this.setState({ // if error occured set message to no recommand friend
				warnText: CONFIG.ADDRESSapi.getRecommandFriendsList.defaultText
			})
		);
	}
	updateRecmdFriendTree(json) {
		
		let res = json, result = res.length > 0 ? res.map((val, i) => {
			return {
				userId: val.id,
				nickName: val.nick_name,
				avatar: val.avatar
			}
		}) : [];
		res.length>0 ? this.setState({
			friendList: result
		}) : this.setState({
				warnText: CONFIG.ADDRESSapi.getRecommandFriendsList.defaultText
		})
	}
	addFriend(e) {
		let args = [].slice.call(arguments, 1), idx = args[0],
			friendInfo=this.state.friendList[idx], cb = args[args.length - 1];
		Input.open((v) => {
			v !== '' ? (this.sendAddRequest(friendInfo, v, cb)) :
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
			friendFrom: 2,
			friendId: friendInfo.userId,
			friendMobile: '',
			msg: msg,
			userId: this.userInfo.id
		};
		// Test block
		// setTimeout(function() {
		// 	self.sendRqSuccess(1, '请求成功！', ''), cb();
		// }, 500);
		HttpHelp.post(
			CONFIG.ADDRESSapi.addFriend.url,
			(code, msg, json) => { Toast.showToast(msg),cb() },
			(code,msg) => log(msg),
			payload
		)
	}
	showProfile(e, msgBody, cb) {
		console.warn(msgBody);
		this.Help.app_open(this, '/PersonDetail', {
			title: msgBody.nickName,
			friendId: msgBody.userId,
			friendFrom: 2,
			callBack: (obj) => obj === 1 ? cb('已发送') : void 0
		})
	}
	render() {
		let {friendList,warnText}=this.state, listViewArr = friendList.length > 0 ? friendList.map((val, i) => {
			let tempListItemProp = {
				messageBody: {
					userId: val.userId,
					avatar: val.avatar,
					nickName: val.nickName
				},
				options: {
					type: 0,
					payload: {
						buttons: [
							{
								text: '添加',
								event: (e,i,cb) => this.addFriend(e,i,cb)
							},
						],
						text:'已发送'
					},
					showInfo: {
						event: (e, msgBody, cb) => this.showProfile(e, msgBody, cb)
					}
				}
			}
			return <ListItem key={i} {...tempListItemProp} position={i}/>
		}) : <div className={css.contact_errText}>
				<div className={css.contact_errText__text}>{ warnText }</div>
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