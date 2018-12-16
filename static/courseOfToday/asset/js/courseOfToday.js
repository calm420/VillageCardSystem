$(function () {
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    var font = WebServiceUtil.GetQueryString('font')
    $('html').css('font-size', font)
    var skin = "skin_default";

    document.querySelector('.home_titleMore').addEventListener('click', function () {
        var data = {
            method: 'openNewPage',
            url: "courseOfToday/tableItemDetil/index.html?roomId=" + roomId + "&skin=" + skin,
        };

        window.parent.postMessage(JSON.stringify(data), '*');
    })

    /**
     * 消息监听
     */
    window.addEventListener('message', function (e) {
        // debugger
        var res = JSON.parse(e.data);
        if (res.command == 'brand_class_open') {
            //查看某个课表项(一接收到开课命令就获取当前开课)
            if (roomId == res.data.classroomId) {
                viewCourseTableItem(res.data)
                document.querySelector('#finish-class').style.display = 'none'
                document.querySelector('#begin-class').style.display = 'block'
            }
        } else if (res.command == 'brand_class_close') {
            if (roomId == res.data.classroomId) {
                //下课
                document.querySelector('#finish-class').style.display = 'block'
                document.querySelector('#begin-class').style.display = 'none'
            }
        } else if (res.command == 'braceletBoxConnect' ) {
            if(!WebServiceUtil.isEmpty(res.data.classTableId)){
                //重连开课
                if (roomId == res.data.classroomId) {
                    viewCourseTableItem(res.data)
                    document.querySelector('#finish-class').style.display = 'none'
                    document.querySelector('#begin-class').style.display = 'block'
                }
            }else{
                document.querySelector('#finish-class').style.display = 'block'
                document.querySelector('#begin-class').style.display = 'none'
            }

        } else if (res.command == 'setSkin') {
            //设置皮肤
            if (schoolId == res.data.schoolId) {
                skin = res.data.skinName;
                document.getElementsByName("courseOfTodayDiv")[0].id = skin;
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
})