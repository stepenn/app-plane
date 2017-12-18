/**
 * Created by lixifeng on 16/11/4.
 */

let APILXF = {

    /**
     *   请求方式 POST
     *   登陆
     *
     */
    api_user_accountLogin: "/api/user/accountLogin",//

    /**
     * 请求方式 POST
     * 退出登录
     */
    api_user_loginOut : "/api/user/loginOut",

    /**
     * 请求方式 POST
     * keyword		string
     * 模糊搜索城市(不传值则表示获取全部城市)
     */
    api_common_gitCityList : "/api/common/gitCityList",

    /**
     * 请求方式 POST
     * lat	经纬度	number
     * lnt	经纬度	number
     * maxCount	获取城市数
     * * 周边城市列表
     */
    api_route_getNearCities : "/api/route/getNearCities",

    /**
     * 请求方式 POST
     * lat	经纬度	number
     * lnt	经纬度	number
     * maxCount	获取城市数
     * * 获取热门城市
     */
    api_route_getHotCities : "/api/route/getHotCities",


    /**
     * 请求方式 POST
     * 获取用户当前位置行政区划
     * lat		string	不传值，取ip
     * lng		string	不传值，取ip
     */
    api_common_gitCityName : "/api/common/gitCityName",
    /**
     * 请求方式 POST
     * payTrip 生成支付订单
     * pay_type	订单类型: 1-定金 2-尾款 3-全款 11-退定金 12-退尾款 13-退全款	string
     * pay_way	支付方式，ALIPAY或者WECHAR	string
     * trip_id	行程报名id	string
     */
    api_pay_payTrip : "/api/pay/payTrip",

    /**
     * 请求方式 POST
     * payTrip 查询复核支付结果
     * pay_type	订单类型: 1-定金 2-尾款 3-全款 11-退定金 12-退尾款 13-退全款	string
     * trip_id	行程报名id	string
     */
    api_pay_queryPayResult : "/api/pay/queryPayResult",

    /**
     * 图片上传
     * image:base64图片
     */
    api_common_uploadImage : "/api/common/uploadImage",


}

module.exports = APILXF;