$(function () {
    var roomId = getQueryString("roomId");

    /**
     * 消息监听
     */
    window.addEventListener('message', (e) => {
        var res = JSON.parse(e.data);
        if (res.command == 'brand_class_open') {
            //查看某个课表项(一接收到开课命令就获取当前开课)
            if (roomId == res.data.classroomId) {
                viewCourseTableItem(res.data)
            }
        } else if (res.command == 'brand_class_close') {
            if (roomId == res.data.classroomId) {
                //下课
            }
        } else if (res.command == 'braceletBoxConnect' && WebServiceUtil.isEmpty(res.data.classTableId) == false) {
            //重连开课
            if (roomId == res.data.classroomId) {
                viewCourseTableItem(res.data)
            }
        }
    })

    /**
     * 查看某个课表项
     * @param data
     */
    function viewCourseTableItem(data) {
        var param = {
            "method": 'viewCourseTableItem',
            "id": data.classTableId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    console.log(result);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
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