/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import css from './Friends.less';
import HelpI from '../../../help/Help.js';
import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import Toast from '../../../component/Toast/index';
import ListItem from '../ListItem';
import CONFIG from '../social.conf';
import HttpHelper from '../../../http/HttpTool';
import COOKIE from '../../../tool/CookieHelp'

class page extends Component {
	constructor(props) {
		super(props);
		this.Help = new HelpI();
		if (this.props.selectCall) {
			this.props.selectCall(this.callback.bind(this));
		}
		COOKIE.getUserInfo();
		this.userInfo = COOKIE.userinfo;
		this.Help.setPageAnimOption(null);
		this.errText = '';
		this.img_magnifier = window.imgHost + '/images/img_magnifier.png';
		this.img_recommand = window.imgHost + '/images/img_addContact.png';
		this.img_veriLock = window.imgHost + '/images/img_veriLock.png';
		this.img_rightArrow = window.imgHost + '/images/icon_right.png';
		this.img_sendMsg = window.imgHost + '/images/icon_msg.png';
		this.img_userInfo = window.imgHost + '/images/icon_userInfo.png';
		this.img_label = window.imgHost + '/images/bg_label.png';
		this.state = {
			verifyCount: 0,
			friendList: []
			// friendList: [
			// 	{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	},{
			// 		userId: 'targetId',
			// 		avatar: 'http://tvax4.sinaimg.cn/crop.0.11.1242.1242.180/61271264ly8fey7pfdnbvj20yi0z442p.jpg',
			// 		nickName: 'targetUserName'
			// 	}
			// ]
		};
	}
	callback(select) {
		//被选择
		if (select) {
			this.fetchNewVerifyFriend();
			this.fetchFriendList();
		}
	}
	componentDidMount() {
		if (this.props.selectCall) {
			this.props.selectCall(this.callback.bind(this));
		}
	}

	/**
	 * get friend list
	 * @param {*param local userId} userId 
	 */
	fetchFriendList() {
		let self = this;
		HttpHelper.post(CONFIG.ADDRESSapi.getFriendsList.url,
			(code,msg,json) => {
				self.updateFriendTree(code,msg,json)
			}, (code,msg) => Toast.showToast(msg))
	}
	fetchNewVerifyFriend() {
		let self = this;
		HttpHelper.post(CONFIG.ADDRESSapi.getNewVerifyNum.url,
			(code, msg, res) => { res.num > 0 ? self.setState({ verifyCount: res.num }) : void 0 },
			(code, msg) => { Toast.showToast(msg) }
		)
	}
	updateFriendTree(code, msg, json) {
		let res = json, result = res.length > 0 ?
			res.map((val, i) => {
				return {
					userId: val.id,
					avatar: val.avatar,
					nickName: val.nick_name
				}
			}) : (this.errText=CONFIG.ADDRESSapi.getFriendsList.defaultText,[]);
		this.setState({
			friendList: result
		})
	}
	openRoute(path, title, targetId) {
		let param = targetId ? { title: title, friendId: targetId } : { title: title, callBack: (txt) => { txt == 'refresh' ? (this.fetchFriendList()) : void 0 } };
		this.Help.app_open(this, path, param);
	}
	sendMsg(e, body) {
		this.openRoute('/MessageInfo', body.nickName, body.userId);
	}
	viewProfile(e, body) {
		this.openRoute('/PersonDetail', body.nickName, body.userId);
	}
	render() {
		let { friendList, verifyCount } = this.state, arrView = friendList.length > 0 ? friendList.map((val, i) => {
			let tmpListItemProp = {
				messageBody: {
					nickName: val.nickName,
					userId: val.userId,
					message: val.message,
					avatar: val.avatar,
				},
				options: {
					type: 2, // 0.Button, 1.Text,2.icon
					payload: {
						icons: [
							{
								iconUrl: this.img_sendMsg,
								text: '消息',
								event: (e, body) => this.sendMsg(e, body)
							}, {
								iconUrl: this.img_userInfo,
								text: '资料',
								event: (e, body) => this.viewProfile(e, body)
							}
						],
						text: ''
					}
				}
			}
			return (
				<ListItem key={i} {...tmpListItemProp}>
				</ListItem>)
		}) : (<div className={css.contact_errText}>
				<div className={css.contact_errText__text}>{this.errText}</div></div>);
		let div = (
			
				<div>
					<div className={css.selectlist}
							onClick={() => {
								{this.openRoute('/Telephone', "通讯录好友");}
								{/*this.Help.app_open(this, '/Telephone', { title: "通讯录好友" });*/}
							}}>
						<div className={css.icon}>
							<img src={this.img_magnifier} alt=""/>
						</div>
						<div className={css.content}>查看手机通讯录好友</div>
						<div className={css.arrow}>
							<img src={this.img_rightArrow} alt=""/>
						</div>
					</div>
					<div className={css.selectlist}
							onClick={()=>{
								this.openRoute("/Recommend","推荐好友");
							}}>
						<div className={css.icon}>
							<img src={this.img_recommand} alt=""/>
						</div>
						<div className={css.content}>推荐好友</div>
						<div className={css.arrow}>
							<img src={this.img_rightArrow} alt=""/>
						</div>
					</div>
					<div className={`${css.selectlist}`}
							onClick={()=>{
								this.openRoute("/VerFriend", "好友验证");
								this.setState({
									verifyCount: 0
								})
							}}>
						<div className={css.icon}>
							<img src={this.img_veriLock} alt=""/>
						</div>
						<div className={css.content}>好友验证</div>
						<div className={`${css.arrow} ${verifyCount > 0 ? css.blink:''}`}>
							<img src={this.img_rightArrow} alt=""/>
						</div>
					</div>
					{/*<div style={{
							backgroundImage:`url(${require('./images/bg_label.png')})`
							}} className={css.contact_label}>
						<div className={css.contact_label__text}>联系人</div>
					</div>*/}
					<div className={css.contact_label} >
						<div className={css.contact_label__text} style={{backgroundImage:this.Help.getImgUrl(this.img_label)}}>联系人</div>
					</div>
					<ScrollView className={`${css.main} ${css.friend_main}`}>
						{arrView}
					</ScrollView>
				</div>
		);
		return div;
	}
}
page.contextTypes = {
	router: React.PropTypes.object
}
module.exports = page;