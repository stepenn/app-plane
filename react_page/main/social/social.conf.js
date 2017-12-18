module.exports = {
	socket: {
		scriptAddr: '/socket.io/socket.io.js',
		params:'?ukey=',
		sendSocketEvent: {
			eventName: 'ClientMsg',
			type: 0 // 0，文字，1，图片，2，表情，3，语音
		},
		recvSocketEvent: {
			recvMsg: {
				eventName: 'ServerMsg',
				type: 0 // 0，文字，1，图片，2，表情，3，语音
			},
			recvRsp: {
				eventName: 'respMsg'
			}
		}
	},
	IMapi: {
		getList: {
			reqMethod: 'POST',
			url: '/api/im/getSessionList',
			defaultText: '暂无新消息<br/>或前往”通讯录-联系人-消息“发起聊天'
		},
		setRead: {
			reqMethod: 'POST',
			url: '/api/im/readUserMsg'
		},
		getMsgHis: {
			reqMethod: 'POST',
			url: '/api/im/charMsgList',
			pageInitCount: 10,
			pageCount: 10,
			pullDepth: 100,
			defaultText: '已经到顶了！'
		}
	},
	INFOapi: {
		getTargetUserInfo: {
			reqMethod: 'POST',
			url: ' /api/user/getOtherUserInfo'
		}
	},
	ADDRESSapi: {
		getFriendsList: {
			reqMethod: 'POST',
			url: '/api/im/getFriendList',
			defaultText: '暂无好友，赶紧去添加好友吧！',
			overlayText: '小拼正在飞速加载中...'
		},
		checkListAdded: {
			reqMethod: 'POST',
			url: '/api/im/pushPhoneList',
			defaultText: '当前通讯录暂无可添加好友！'
		},
		getVeriFriendList: {
			reqMethod: 'POST',
			url: '/api/im/getSemiFriendList',
			defaultText: '暂无新的好友请求'
		},
		deleteFriend: {
			reqMethod: 'POST',
			url:'/api/im/removeFriend'
		},
		addFriend: {
			reqMethod: 'POST',
			url: '/api/im/addFriend',
			defaultText: '请输入验证消息！'
		},
		getRecommandFriendsList: {
			reqMethod: 'POST',
			url: '/api/im/getPushUserList',
			defaultText: '暂无推荐好友'
		},
		sendVerify:{
			reqMethod: 'POST',
			url: '/api/im/reviewFriend'
		},
		getNewVerifyNum: {
			reqMethod: 'POST',
			url: '/api/im/getNewFriends'
		},
		setVerifyListRead: {
			reqMethod: 'POST',
			url: '/api/im/updateNewFriend'
		}
	}
}