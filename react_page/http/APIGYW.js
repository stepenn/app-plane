/**
 * Created by lixifeng on 16/11/4.
 */
let APIGYW = {
    api_user_register : "/api/user/accountRegister",/*注册*/

    api_user_accountGetcode : "/api/user/accountGetcode",/*获取验证码*/

    api_user_checkOpenId : "/api/user/checkOpenId",/*第三方登录绑定手机号*/

    api_user_bindRegistrationId : "/api/user/bindRegistrationId",/*绑定设备id*/

    api_user_authBindPhone : "/api/user/authBindPhone",/*检查第三方用户id是否已经注册过*/

    api_user_forgetPwd : "/api/user/forgetPwd",/*忘记密码*/

    api_user_userInfoAlter : "/api/user/userInfoAlter",/*修改个人信息*/
    api_user_userInfo : "/api/user/userInfo",/*获取个人信息*/


    api_user_delUserImage : "/api/user/delUserImage",/*删除单张用户图片*/

    api_user_getDefaultTags : "/api/user/getDefaultTags",/*获取默认标签*/

    api_user_getUserTags : "/api/user/getUserTags",/*获取自定义标签*/

    api_user_updateUserTags : "/api/user/updateUserTags",/*更新用户自定义标签*/

    api_user_userFeedback : "/api/common/userFeedback",/*用户意见反馈*/

    api_user_getOtherUserInfo : "/api/user/getOtherUserInfo",/*查看别人用户信息*/

    api_user_addFriend : "/api/im/addFriend",/*添加好友*/

    api_passenger_getPassengerList : "/api/passenger/getPassengerList",/*常用乘机人列表*/

    api_passenger_addPassenger : "/api/passenger/addPassenger",/*添加常用乘机人*/

    api_common_gitCountryList : "/api/common/gitCountryList",/*获取国家列表*/

    api_passenger_resetPwd : "/api/user/resetPwd",/*添加常用乘机人*/

    api_passenger_delPassenger : "/api/passenger/delPassenger",/*删除常用乘机人*/

    api_passenger_editPassenger : "/api/passenger/editPassenger",/*修改乘机人*/

    api_passenger_getMyTrips : "/api/route/getMyTrips",/*我的行程列表*/

    api_passenger_getTripDetail : "/api/route/getTripDetail",/*我报名的行程详情*/

    api_passenger_refundTrip : "/api/pay/refundTrip",/*refundTrip 退款*/

    api_common_getBuyNotice : "/api/common/getBuyNotice",/*getBuyNotice 起航小贴士*/

    api_common_getAboutAipin : "/api/common/getAboutAipin",/*getAboutAipin 关于爱拼机*/

    api_leader_addLeader : "/api/leader/addLeader",/*addLeader 领队申请认证*/

    api_route_editRouteLog : "/api/route/editRouteLog",/*editRouteLog 修改我的行程日志*/

    api_common_getWXJsToken : "/api/common/getWXJsToken",/*getWXJsToken 获取微信js调用签名*/
}

module.exports = APIGYW;