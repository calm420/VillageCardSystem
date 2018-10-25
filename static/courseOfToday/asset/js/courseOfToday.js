$(function () {
    var clazzId = getQueryString("clazzId");
    var roomId = getQueryString("roomId");
    console.log(clazzId);
    console.log(roomId);

    /**
     * 消息监听
     */
    window.addEventListener('message', (e) => {
        var res = JSON.parse(e.data);
        console.log(res);
    })


    /**
     * 获取地址栏参数
     * @param name
     * @returns {null}
     * @constructor
     */
    function getQueryString(parameterName) {
        var reg = new RegExp("(^|&)" + parameterName + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})