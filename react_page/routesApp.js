/**
 * Created by lixifeng on 17/6/8.
 */
import React from 'react';
import Config from './Config.js';
import { Route, IndexRedirect, Router, hashHistory,  IndexRoute, browserHistory } from 'react-router';

var isApp = !Config.ISSAP; // set route mode to spa (false) or non-spa (true)


var DemoNative = {
	path: 'DemoNative',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('./main/demo/DemoNative.js'))
		}, 'DemoNative')
	}
}

var DemoImage = {
	path: 'DemoImage',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null,require('./main/demo/DemoImage.js'))
		}, 'DemoImage')
	}
}

var DemoContacts = {
	path: 'DemoContacts',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoContacts.js'))
		}, 'DemoContacts')
	},
	childRoutes: []
};

var DemoPay = {
	path: 'DemoPay',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoPay.js'))
		}, 'DemoPay')
	},
	childRoutes: []
};

var DemoLocation = {
	path: 'DemoLocation',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoLocation.js'))
		}, 'DemoLocation')
	},
	childRoutes: []
};

var DemoLogin = {
	path: 'DemLogin',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoLogin.js'))
		}, 'DemLogin')
	},
	childRoutes: []
};

var DemoShare = {
	path: 'DemoShare',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoShare.js'))
		}, 'DemoShare')
	},
	childRoutes: []
};

var DemoPageHttp = {
	path: 'DemoPageHttp',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoPageHttp.js'))
		}, 'DemoPageHttp')
	},
	childRoutes: []
};

var DemoPageDialog = {
	path: 'DemoPageDialog',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoPageDialog.js'))
		}, 'DemoPageDialog')
	},
	childRoutes: []
};

var DemoPageListView = {
	path: 'DemoPageListView',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoPageListView.js'))
		}, 'DemoPageListView')
	},
	childRoutes: []
};

var DemoPageScroll = {
	path: 'DemoPageScroll',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoPageScroll.js'))
		}, 'DemoPageScroll')
	},
	childRoutes: []
};

var DemoBar = {
	path: 'DemoBar',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoBar.js'))
		}, 'DemoBar')
	},
	childRoutes: []
};

var DemoParameter = {
	path: 'DemoParameter',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoParameter.js'))
		}, 'DemoParameter')
	},
	childRoutes: []
};

var DemoDiyBar = {
	path: 'DemoDiyBar',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoDiyBar.js'))
		}, 'DemoDiyBar')
	},
	childRoutes: []
};

var DemoNoAnim = {
	path: 'DemoNoAnim',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoNoAnim.js'))
		}, 'DemoNoAnim')
	},
	childRoutes: []
};

var DemoAnimUp = {
	path: 'DemoAnimUp',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoAnimUp.js'))
		}, 'DemoAnimUp')
	},
	childRoutes: []
};

var DemoCallBack2 = {
	path: 'DemoCallBack2',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoCallBack2.js'))
		}, 'DemoCallBack2')
	},
	childRoutes: []
};

var DemoCallBack = {
	path: 'DemoCallBack',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/demo/DemoCallBack.js'))
		}, 'DemoCallBack')
	},
	childRoutes: [ DemoCallBack2 ]
};

/** !important
*	can't change location cuz childRoute may be undefined from initialization **/
var Demo = {
	path: 'Demo',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('./main/demo/Demo.js'))
		}, 'Demo')
	},
	childRoutes: [
		DemoNative,
		DemoImage,
		DemoContacts,
		DemoPay,
		DemoLogin,
		DemoShare,
		DemoPageHttp,
		DemoPageDialog,
		DemoPageListView,
		DemoPageScroll,
		DemoBar,
		DemoParameter,
		DemoDiyBar,
		DemoNoAnim,
		DemoAnimUp,
		DemoCallBack
	]
};

var CerID = {
	path: 'CerID',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/certification/CerID.js'))
		}, 'CerID')
	},
	childRoutes: [ ]
};

var BindPhone = {
	path: 'BindPhone',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/login/BindPhone.js'))
		}, 'BindPhone')
	},
	childRoutes: []
};

var Regist = {
	path: 'Regist',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/login/Regist.js'))
		}, 'Regist')
	},
	childRoutes: []
};

var Login = {
	path: 'Login',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/login/Login.js'))
		}, 'Login')
	},
	childRoutes: [Regist, BindPhone]
};

var PersonDetail = {
	path: 'PersonDetail',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/PersonDetail.js'))
		}, 'PersonDetail')
	},
	childRoutes: []
};

var Employees = {
	path: 'Employees',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/MyLeaderTeam/Employees.js'))
		}, 'Employees')
	},
	childRoutes: [ PersonDetail ]
};

var MessageInfo = {
	path: 'MessageInfo',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/social/message/MessageInfo.js'))
		}, 'MessageInfo')
	},
	childRoutes: [PersonDetail]
};

var UserInfoShow = {
	path: 'UserInfoShow',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/UserInfoShow.js'))
		}, 'UserInfoShow')
	},
	childRoutes: [MessageInfo]
};

var AddPlanePer = {
	path: 'AddPlanePer',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/AddPlanePer.js'))
		}, 'AddPlanePer')
	},
	childRoutes: []
};

var MyPlane = {
	path: 'MyPlane',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/MyPlane.js'))
		}, 'MyPlane')
	},
	childRoutes: [ AddPlanePer ]
};

var TicketInforDesc = {
	path: 'TicketInforDesc',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/TicketInforDesc.js'))
		}, 'TicketInforDesc')
	},
	childRoutes: [ ]
};

var PrePay = {
	path: 'PrePay',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/pay/PrePay.js'))
		}, 'PrePay')
	},
	childRoutes: [ TicketInforDesc, MyPlane]
};

var TicketInforDescWithPrepay = {
	path: 'TicketInforDescWithPrepay',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/TicketInforDesc.js'))
		}, 'TicketInforDescWithPrepay')
	},
	childRoutes: [ PrePay ]
};

var OrderDetail = {
	path: 'OrderDetail',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/OrderDetail.js'))
		}, 'OrderDetail')
	},
	childRoutes: [ PrePay ]
};

var TripDetail = {
	path: 'TripDetail',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/TripDetail.js'))
		}, 'TripDetail')
	},
	childRoutes: [ TicketInforDescWithPrepay, OrderDetail ]
};

var TicketState = {
	path: 'TicketState',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/TicketState.js'))
		}, 'TicketState')
	},
	childRoutes: [MyPlane, AddPlanePer]
};

var MyTrip = {
	path: 'MyTrip',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/MyTrip.js'))
		}, 'MyTrip')
	},
	childRoutes: [
		PrePay,
		TripDetail,
		TicketState
	]
};

var SelectCity = {
	path: 'SelectCity',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/public/SelctCity/SelectCity.js'))
		}, 'SelectCity')
	},
	childRoutes: [ ]
};

var AddDesire = {
	path: 'AddDesire',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/social/desire/AddDesire.js'))
		}, 'AddDesire')
	},
	childRoutes: [ DesireSuccess ]
};

var DesireDetail = {
	path: 'DesireDetail',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/social/desire/DesireDetail.js'))
		}, 'DesireDetail')
	},
	childRoutes: [ PersonDetail ]
};

var Recommand = {
	path: 'Recommand',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/social/friends/Recommend.js'))
		}, 'Recommand')
	},
	childRoutes: [ PersonDetail ]
};

var VerFriend = {
	path: 'VerFriend',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/social/friends/VerFriend.js'))
		}, 'VerFriend')
	},
	childRoutes: [ PersonDetail ]
};

var Telephone = {
	path: 'Telephone',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/social/friends/Telephone.js'))
		}, 'Telephone')
	},
	childRoutes: [ PersonDetail ]
};

var AddSign = {
	path: 'AddSign',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/AddSign.js'))
		}, 'AddSign')
	},
	childRoutes: [ ]
};

var MySign = {
	path: 'MySign',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/MySign.js'))
		}, 'MySign')
	},
	childRoutes: [ AddSign ]
};

var SelectCityList = {
	path: 'SelectCityList',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/public/SelctCity/SelectCityList.js'))
		}, 'SelectCityList')
	},
	childRoutes: [ ]
};

var VerTeamer = {
	path: 'VerTeamer',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/certification/VerTeamer.js'))
		}, 'VerTeamer')
	},
	childRoutes: [ CerID,SelectCityList ]
};

var AlterPersonInfor = {
	path: 'AlterPersonInfor',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/AlterPersonInfor.js'))
		}, 'AlterPersonInfor')
	},
	childRoutes: [ ]
};

var UserInfo = {
	path: 'UserInfo',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/UserInfo.js'))
		}, 'UserInfo')
	},
	childRoutes: [
		MySign,
		SelectCityList,
		AlterPersonInfor
	]
};

var MyPeriodization = {
	path: 'MyPeriodization',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/MyPeriodization.js'))
		}, 'MyPeriodization')
	},
	childRoutes: [ ]
};

var Feedback = {
	path: 'Feedback',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/Feedback.js'))
		}, 'Feedback')
	},
	childRoutes: [ ]
};

var AboutAiPinJi = {
	path: 'AboutAiPinJi',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/detail/AboutAiPinJi.js'))
		}, 'AboutAiPinJi')
	},
	childRoutes: [ ]
};

var AlterPW = {
	path: 'AlterPW',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/login/AlterPW.js'))
		}, 'AlterPW')
	},
	childRoutes: [ ]
};

var Setting = {
	path: 'Setting',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/Setting.js'))
		}, 'Setting')
	},
	childRoutes: [AboutAiPinJi, AlterPW, Login]
};

var SocialBar = {
	path: 'SocialBar',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/social/SocialBar.js'))
		}, 'SocialBar')
	},
	childRoutes: [
		MessageInfo,
		UserInfoShow,
		Login,
		AddDesire,
		DesireDetail,
		Recommand,
		VerFriend,
		Telephone,
		PersonDetail
	]
};

var BeginCity = {
	path: 'BeginCity',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/beginCity/beginCity.js'))
		}, 'BeginCity')
	},
	childRoutes: [ ]
};

var EndCity = {
	path: 'EndCity',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/EndCity/EndCity.js'))
		}, 'EndCity')
	},
	childRoutes: [ ]
};

var FriendSelect = {
	path: 'FriendSelect',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/FriendSelect/FriendSelect.js'))
		}, 'FriendSelect')
	},
	childRoutes: [ ]
};

var Agreement = {
	path: 'Agreement',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/ticket/Agreement/Agreement.js'))
		}, 'Agreement')
	},
	childRoutes: [ ]
};

var MoreFlights = {
	path: 'MoreFlights',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/ticket/MoreFlights/MoreFlights.js'))
		}, 'MoreFlights')
	},
	childRoutes: [ ]
};

var Ticket = {
	path: 'Ticket',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/ticket/ticket.js'))
		}, 'Ticket')
	},
	childRoutes: [ Agreement,MoreFlights ]
};

var Siege = {
	path: 'Siege',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/Siege/Siege.js'))
		}, 'Siege')
	},
	childRoutes: [ ]
};

var PublicTeamTrip = {
	path: 'PublicTeamTrip',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/PublicTeamTrip.js'))
		}, 'PublicTeamTrip')
	},
	childRoutes: [BeginCity, EndCity, FriendSelect, Ticket, Siege, PrePay]
};

var MoreMember = {
	path: 'MoreMember',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/TripDetails/MoreMember/MoreMember.js'))
		}, 'MoreMember')
	},
	childRoutes: [ PersonDetail ]
};

var TripDetails = {
	path: 'TripDetails',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/index/TripDetails/TripDetails.js'))
		}, 'TripDetails')
	},
	childRoutes: [ FriendSelect,PrePay,MoreMember ,PersonDetail ]
};

var MyTeam = {
	path: 'MyTeam',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/MyTeam.js'))
		}, 'MyTeam')
	},
	childRoutes: [Siege, Employees, TripDetail, VerTeamer, PublicTeamTrip]
};

var User = {
	path: 'User',
	getComponent(nextState, cb) {
		require.ensure([], require => {
			cb(null,require('./main/user/User.js'))
		}, 'User')
	},
	childRoutes: [
		Login,
		UserInfoShow,
		UserInfo,
		MyPeriodization,
        MyPlane,
		MyTeam,
		MyTrip,
		Feedback,
		Setting,
		PersonDetail,

	]
};

const rootRoute = {
	path: '/',
	getComponent:(nextState, cb) =>{
		require.ensure([], (require) => {
			cb(null, require('./main/App.js'))
		}, 'App')
	},
	childRoutes: [
		Demo,
		SelectCity,
		SocialBar,
		User,
		Login,
		PrePay,
		MyTrip,
		MyTeam,
		BeginCity,
		EndCity,
		FriendSelect,
		Ticket,
		TripDetails
	]
}


/**
 * APP版本上线,设置为非SPA模式
 * @type {Array}
 */
var rootArr = [];
if(isApp){
	var exe = (obj,arr)=>{
		if(obj.childRoutes&&obj.childRoutes.length>0){
			//递归 判断是否由子路由 ,如果存在,提取为同级路由,并删除子路由
			for (var child of obj.childRoutes) {
				var tmp = Object.create(child)
				tmp.path = (obj.path === '/') ? (obj.path + tmp.path) : (obj.path + '/' + tmp.path);
				exe(tmp, arr);
			}
			delete obj.childRoutes;
		}
		rootArr.push(obj);
	}
	exe(rootRoute,rootArr);
}else{
	rootArr.push(rootRoute);
}

const root =

		<Router history={hashHistory} routes={rootArr} />;

/*const root =
	<Router  history={hashHistory}>
		<Route path='/' component={rootNode}>

			<IndexRedirect to='index' />
			<Route path='index' getComponent={(location, cb) => {
				require.ensure([], require => {
					cb(null, require('./main/App.js'));
				}, 'index');
			}} >

			</Route>
			<Route path='index/Demo' getComponent={(location, cb) => {
				require.ensure([], require => {
					cb(null, require('./main/demo/Demo.js'));
				}, 'Demo');
			}} />
		</Route>
	</Router>*/
module.exports = root;