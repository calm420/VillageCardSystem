$(function () {
    var roomId = getQueryString("roomId");
    viewCourseTable(roomId)


    function viewCourseTable(roomId) {
        var param = {
            "method": 'viewRoomCourseTable',
            "rid": roomId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    buileTable(result.response)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    function buileTable(data) {
        var tbody = ''
        var td;
        for (var k in data) {
            var tr = '';
            data[k].forEach((e) => {
                if (!!e.courseName) {
                    td = '<td><span>' + e.courseName + '</span><span>' + e.classRoom.name + '</span> <span>(' + e.openTime + '-' + e.closeTime + ')</span> </td>'
                } else {
                    td = '<td></td>'
                }
                tr += td;
            })
            var trs = '<tr><td>' + k + '</td>' + tr + '</tr>'
            tbody += trs
        }
        document.querySelector('tbody').innerHTML = tbody
    }

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