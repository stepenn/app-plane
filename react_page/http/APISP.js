
let APISP = {
    api_route_getNearCities : "/api/route/getNearCities", //附近城市


    /**
     * 变量名	含义	类型	备注
     * fromOrTo	from=搜索出发城市， to=搜索到达城市，不传则取前者
     * keyword
     */
    api_route_searchDepartCities : "/api/route/searchCities", //关键字搜索城市清单 搜索

    /**
     * /获取爱拼机购票协议
     */
    api_common_getBuyAgreement : "/api/common/getBuyAgreement", ///获取爱拼机购票协议


    api_route_getHotCities : "/api/route/getHotCities", //热门客场
    api_route_getUserCommendedCities:'/api/route/getUserCommendedCities',//主推着陆城市


    api_route_searchCities:'/api/route/searchDepartCities',//搜索到达城市
    api_route_getYYMMDayNight:'/api/route/getYYMMDayNight' ,//几天几晚数据
    api_route_getFlightLines:'/api/route/getFlightLines',//获取航班列表
    api_route_publishRoute:'/api/route/publishRoute', //发布行程
    api_route_getRouteListByCityName:'/api/route/getRouteListByCityName',//招募令列表(首页气泡)
    api_route_getRouteDetail:'/api/route/getRouteDetail',// 招募令详情
    api_route_joinRoute:'/api/route/joinRoute',//加入行程(归队)
    api_im_addFriend:'/api/im/addFriend',//添加好友
    api_route_getRouteMembers:'/api/route/getRouteMembers',//成员头像
    api_pay_getTripAmount:'/api/pay/getTripAmount',//得到需要支付金额
    api_route_saveTripPassengers:'/api/route/saveTripPassengers',//选择并保存航班的乘机人
    api_common_recodeShare:'/api/common/recodeShare'//用户分享
}
module.exports = APISP;
