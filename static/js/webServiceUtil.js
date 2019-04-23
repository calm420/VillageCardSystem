//本地调试时,需要设置为true,保证ifream的跳转路径为本地地址,发版时一定要调整为false
WebServiceUtil.isDebug_ifream = true;
//请求api的debug设置,做本地调试,调用本地接口时,需要设置为true,否则为false,发版时一定要调整为false
WebServiceUtil.isDebug = true;
//simple消息服务的debug设置,需要调用本地simple消息服务时,需要设置为true,否则为false,发版时一定要调整为false
WebServiceUtil.isDebug_simpleScoket = true;
//message消息服务的debug设置,需要调用本地message消息服务时,需要设置为true,否则为false,发版时一定要调整为false
WebServiceUtil.isDebug_messageScoket = true;

WebServiceUtil.localDomain = "192.168.50.15";   //请求地址接口

WebServiceUtil.localDebugUrl = "192.168.50.30";   //本地调试的地址,嵌套ifream页面使用的地址

//小蚂蚁webService地址
var apiWebServiceURLOfLocals = "http://" + WebServiceUtil.localDomain + ":9006/Excoord_ApiServer/webservice";
var apiWebServiceURLOfRemote = "https://www.maaee.com/Excoord_For_Education/webservice";
var apiWebServiceURL = WebServiceUtil.isDebug ? apiWebServiceURLOfLocals : apiWebServiceURLOfRemote;

WebServiceUtil.SMALL_IMG = 'size=100x100';
WebServiceUtil.MIDDLE_IMG = 'size=300x300';
WebServiceUtil.LARGE_IMG = 'size=500x500';

function WebServiceUtil() {

};

WebServiceUtil.requestLittleAntApi = function (flag, data, listener) {
    $.ajax({
        type: "post",
        url: apiWebServiceURL,
        data: {params: data},
        dataType: "json",
        success: function (result) {
            listener.onResponse(result);
        }, error: function (error) {
            listener.onError(error);
        }
    });
}

/**
 * 系统非空判断
 * @param content
 * @returns {boolean}
 */
WebServiceUtil.isEmpty = function (content) {
    if (content == null || content == "null" || content == "" || typeof(content) == "undefined") {
        return true;
    } else {
        return false;
    }
};

/**
 * 时间戳转年月日
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatYMD = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    var ymdStr = [year, month, date].join('-');
    return ymdStr;
};

/**
 * 时间戳转年月日
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatMD = function (nS) {
    var da = new Date(parseInt(nS));
    var month = da.getMonth() + 1;
    var date = da.getDate();
    var ymdStr = month+"月"+date+"日";
    return ymdStr;
};

/**
 * 时间戳转年月
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatYM = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var ymdStr = [year, month].join('-');
    return ymdStr;
};

/**
 * 时间戳转时分
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatHM = function (nS) {
    var da = new Date(parseInt(nS));
    var hour = da.getHours();
    var minutes = da.getMinutes();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var hmStr = hour + ":"+ minutes;
    return hmStr;
};

WebServiceUtil.createUUID = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};

//获取地址栏参数
WebServiceUtil.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}



