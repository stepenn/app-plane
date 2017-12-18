var express = require('express');
var router = express.Router();
var request = require('request');
var myconfig = require('../config/setting.js');
/* GET home page. */
/*
 162
 103胡
 94志
 * */
//拦截所有 /api 请求进行转发
router.post('/api/*', function (req, res, next) {
    var url = 'http://' + '10.0.0.103:7090' + req.originalUrl;
    console.log('\n');
    console.log("==== url    : " + url);
    console.log("==== form   : " + JSON.stringify(req.body));

    var heads = {};
    for (var v in req.headers) {
        if (v === "content-length" ||
            v === "host" ||
            v === "referer" ||
            v === "origin"
        ) {
            continue;
        }
        heads[v] = req.header(v);
    }
    //为了兼容开发环境
    var ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/);
    heads.IP = '117.149.14.83';
    // ip[0] 访问者IP
    request.post(
        {
            url: url,
            headers: heads,
            form: req.body,
        },
        function (err, httpResponse, body) {
            if (err) {
                res.statusCode = 505;
                res.send('net error');
            } else {
                res.statusCode = httpResponse.statusCode;
                res.send(body);
                console.log("==== result : " + body);
            }
        });
});


/**
 * IOS用到审核版本,并审核通过版本
 */
router.get('/app/ios14', function (req, res, next) {
    res.render('index');
});
router.get('/app/ios', function (req, res, next) {
    var uuid = require('node-uuid');
    res.cookie('apinkey',uuid.v1());
    console.log(req.cookies);
    console.log("no Apin------------------");
    res.render('index');
});
router.get('/app/android', function (req, res, next) {
    var uuid = require('node-uuid');
    res.cookie('apinkey',uuid.v1());
    console.log(req.cookies);
    console.log("no Apin------------------");
    res.render('index');
});
router.get('/app/pc', function (req, res, next) {
    var uuid = require('node-uuid');
    res.cookie('apinkey',uuid.v1());
    console.log(req.cookies);
    console.log("no Apin------------------");
    res.render('index');
});

router.get('/app', function (req, res, next) {
    //如果是微信浏览器返回true 否则返回false

    var a = req.get('user-agent');
    var b = req.get('x-ucbrowser-ua');

    var userAgentInfo = a?a.toLowerCase():""+b?b.toLowerCase():"";
    console.log("=====ver=======");
    console.log(userAgentInfo);
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod","UCBrowser"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v].toLowerCase()) > 0) {
            flag = false;
            break;
        }
    }
    var uuid = require('node-uuid');
    res.cookie('apinkey',uuid.v1());
    console.log(req.cookies);
    console.log("no Apin------------------");
    //判断,如果是PC
    if (flag) {
        res.render('pc');
    } else {
        res.render('index');
    }

});
router.get('/', function (req, res, next) {
    res.redirect("/app/")
});





module.exports = router;
