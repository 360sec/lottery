'use strict';
// Global.API = 'http://doctor.dev.pajkdc.com:9090/m.api';
//var SIMS_API_URL, SIMS_STATIC_URL, IM_STATIC_URL,YAO_STATIC_URL,FORM_STATIC_URL,SLOT_API,YAO_IMG_URL,YAO_COOKIE_URL;
//if(location.host.indexOf("jc.dev.pajkdc.com") != -1){
//    // 集成开发环境
//    SIMS_API_URL      = 'http://api.jc.dev.pajkdc.com/m.api';
//    SIMS_STATIC_URL   = 'http://10.0.18.141/v1/tfs/';
//    YAO_STATIC_URL     = 'http://drugstore.dev.pajkdc.com/#/';
//    YAO_COOKIE_URL     = 'dev.pajkdc.com';
//    FORM_STATIC_URL     = 'http://p.dev.pajkdc.com/';
//    SLOT_API          = 'http://p.dev.pajkdc.com/promotion-web/lottery/proDraw';
//    YAO_IMG_URL       = 'http://static.dev.pajkdc.com/';
//}else if(location.host.indexOf("dev.pajkdc.com") != -1){
//    // 开发环境
//    //SIMS_API_URL    = 'http://api.dev.pajkdc.com/m.api';
//    SIMS_API_URL      = 'http://api.jc.dev.pajkdc.com/m.api';
//    SIMS_STATIC_URL = 'http://10.0.18.141/v1/tfs/';
//    YAO_STATIC_URL     = 'http://drugstore.dev.pajkdc.com/#/';
//    YAO_COOKIE_URL     = 'dev.pajkdc.com';
//    FORM_STATIC_URL     = 'http://p.dev.pajkdc.com/';
//    SLOT_API          = 'http://p.dev.pajkdc.com/promotion-web/lottery/proDraw';
//    YAO_IMG_URL       = 'http://static.test.pajkdc.com/v1/tfs/';
//}else if(location.host.indexOf("test.pajkdc.com") != -1){
//    // 测试环境
//    SIMS_API_URL      = 'http://api.test.pajkdc.com/m.api';
//    SIMS_STATIC_URL   = 'http://10.128.240.46/v1/tfs/';
//    YAO_STATIC_URL     = 'http://yao-h5.test.pajkdc.com/#/';
//    YAO_COOKIE_URL     = 'test.pajkdc.com';
//    FORM_STATIC_URL     = 'http://p.dev.pajkdc.com/';
//    SLOT_API          = 'http://promotion.test.pajkdc.com/promotion/lottery/proDraw';
//    YAO_IMG_URL       = 'http://static.test.pajkdc.com/v1/tfs/';
//}else if(location.host.indexOf("pre.jk.cn") != -1){
//    // 预发环境
//    SIMS_API_URL      = 'http://api.pre.jk.cn/m.api';
//    SIMS_STATIC_URL   = 'http://static.jk.cn/';
//    YAO_STATIC_URL     = 'http://yao-h5.pre.jk.cn/#/';
//    YAO_COOKIE_URL     = 'pre.jk.cn';
//    FORM_STATIC_URL     = 'http://p.jc.dev.pajkdc.com/';
//    SLOT_API          = 'http://promotion.pre.jk.cn/promotion/lottery/proDraw';
//    YAO_IMG_URL       = 'http://static.jk.cn/';
//}else if(location.host.indexOf("jk.cn") != -1){
//    // 正式线上环境
//    SIMS_API_URL      = 'http://api.jk.cn/m.api';
//    SIMS_STATIC_URL   = 'http://static.jk.cn/';
//    YAO_STATIC_URL     = 'http://yao-h5.jk.cn/#/';
//    YAO_COOKIE_URL     = 'jk.cn';
//    FORM_STATIC_URL     = 'http://insurance-record.jk.cn/';
//    SLOT_API          = 'http://promotion.jk.cn/promotion/lottery/proDraw';
//    YAO_IMG_URL       = 'http://static.jk.cn/';
//}else{
//    SIMS_API_URL      = 'http://api.jc.dev.pajkdc.com/m.api';
//    SIMS_STATIC_URL   = 'http://10.0.18.141/v1/tfs/';
//    YAO_STATIC_URL     = 'http://yao-h5.jk.cn/#/';
//    YAO_COOKIE_URL     = 'jk.cn';
//    FORM_STATIC_URL     = 'http://insurance-record.jk.cn/';
//    SLOT_API          = 'http://promotion.jk.cn/promotion/lottery/proDraw';
//    YAO_IMG_URL       = 'http://static.jk.cn/';
//}

var API = {

    //请求头
    setting: {
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded;charset=UTF-8"
    },


    //请求函数
    request: function(params, fn, level, showLoading) {
        if (level != "None") {
            this.setting.xhrFields = {
                withCredentials: true
            };
        }

        this.setting.timeout = 15000;

        //请求api路径
        this.setting.url = 'http://api.test.pajkdc.com/m.api';
//        this.setting.url = 'http://api.jk.cn/m.api';


        this.setting.data = this.encrypt(level, params);

        //请求成功
        this.setting.success = function(data) {

            if (data && data.stat && data.stat.code < 0) {

                if (data.stat.code == '-300') {
                    alert("登录状态已过期，请重新登录");
                };

                if (data.stat.code == '-360') {
                    // alert("登录状态错误，请重新登录");
                    var ut = api.getCookie("_wtk");
                    if(window.pajkPostMessage && !ut){
                        var success = function(data){
                            console.log('pajkPostMessage success');
                        }
                        var error = function(data){
                            console.log('pajkPostMessage error');
                        }
                        var option = {
                            "action": 1,
                            "type": 3,
                            "data":{}
                        }
                        pajkPostMessage(success,error,option);
                    }
                };

                if (data.stat.code == '-320' || data.stat.code == '-340') {
                    alert("该帐号已在其他地方登录");
                };

                if (data.stat.code == '-300' || data.stat.code == '-360' || data.stat.code == '-320' || data.stat.code == '-340') {

                }

            } else {
                fn(data);
            }

        };


        //请求失败
        this.setting.error = function(xhr, type) {
            // alert("请求失败");
            // hideLoader();
        };

        //ajax请求
        $.ajax(this.setting);
    },

    //加密
    encrypt: function(level, params) {
        params._sm = "md5";

        var s = "",
            keys = [];
        for (var k in params) {
            keys.push(k);
        }
        keys.sort();

        for (var i = 0; i < keys.length; i++) {
            s = s + keys[i] + "=" + params[keys[i]];
        }

        s += this.getHash(level);
        console.log(params._mt + "   >>>   " + s);
        params._sig = $.md5(s);
        return params;
    },


    //获取token请求api
    getHash: function(level) {

        var ut = this.getCookie("_wtk");

        if (level == "None") {
            return "jk.pingan.com";
        } else if (ut) {
            return ut;
        } else {
            return window.localStorage.getItem('CF_TOKEN');
            // return window.location.hash.replace("#","");
        }

        // var myHash = window.localStorage.getItem('CF_TOKEN');
        // var BASE_DOMAIN = '.test.pajkdc.com';
        // document.domain="test.pajkdc.com";
        // document.cookie = '_wtk='+ myHash +'; path=/; domain=' + BASE_DOMAIN;
    },

    getCookie: function (name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if ( arr = document.cookie.match(reg) ) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },

    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(window.location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


};

