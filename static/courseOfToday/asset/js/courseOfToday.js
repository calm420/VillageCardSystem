$(function () {
    var roomId = getQueryString("roomId");

    document.querySelector('.home_titleMore').addEventListener('click', () => {
        var data = {
            method: 'openNewPage',
            url: "homeworkModule/index.html?classId="+classId,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = "homeworkModule/index.html?classId="+classId;
        });
    })

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
                    document.querySelector('.time').innerHTML = result.response.openTime + '-' + result.response.closeTime

                    var img = document.createElement("img");
                    img.src = result.response.teacher.avatar
                    img.className = "terPic"
                    document.querySelector('#begin-class').insertBefore(img, document.querySelector('.ter_name'))

                    document.querySelector('.name').innerHTML = result.response.courseName
                    document.querySelector('.ter_name').innerHTML = result.response.teacher.userName
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