$(function () {
    var villageId = WebServiceUtil.GetQueryString("villageId");
    var font = WebServiceUtil.GetQueryString('font');
    $('html').css('font-size', font);
    var skin = "skin_default";

<<<<<<< HEAD
    // /**
    //  * 消息监听
    //  */
    // window.addEventListener('message', function (e) {
    //     // debugger
    //     var res = JSON.parse(e.data);
    //     if (res.command == 'brand_class_open') {
    //         //查看某个课表项(一接收到开课命令就获取当前开课)
    //         if (roomId == res.data.classroomId) {
    //             viewCourseTableItem(res.data)
    //             document.querySelector('#finish-class').style.display = 'none'
    //             document.querySelector('#begin-class').style.display = 'block'
    //         }
    //     } else if (res.command == 'brand_class_close') {
    //         if (roomId == res.data.classroomId) {
    //             //下课
    //             document.querySelector('#finish-class').style.display = 'block'
    //             document.querySelector('#begin-class').style.display = 'none'
    //         }
    //     } else if (res.command == 'braceletBoxConnect' ) {
    //         if(!WebServiceUtil.isEmpty(res.data.classTableId)){
    //             //重连开课
    //             if (roomId == res.data.classroomId) {
    //                 document.querySelector('#finish-class').style.display = 'none';
    //                 document.querySelector('#begin-class').style.display = 'block';
    //             }
    //         }else{
    //             document.querySelector('#finish-class').style.display = 'block'
    //             document.querySelector('#begin-class').style.display = 'none'
    //         }
    //
    //     } else if (res.command == 'setSkin') {
    //         //设置皮肤
    //         if (schoolId == res.data.schoolId) {
    //             skin = res.data.skinName;
    //             // document.getElementsByName("courseOfTodayDiv")[0].id = skin;
    //         }
    //     }
    // });
=======
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
                    document.querySelector('#finish-class').style.display = 'none';
                    document.querySelector('#begin-class').style.display = 'block';
                }
            }else{
                document.querySelector('#finish-class').style.display = 'block'
                document.querySelector('#begin-class').style.display = 'none'
            }

        } else if (res.command == 'setSkin') {
            //设置皮肤
            if (schoolId == res.data.schoolId) {
                skin = res.data.skinName;
                // document.getElementsByName("courseOfTodayDiv")[0].id = skin;
            }
        }
    });
>>>>>>> cb3449c7abdec33ebb570838e237b06bcd10a740
    getCourseTable(villageId);
    /**
     * 查看某个课表项
     * @param data
     */
    function getCourseTable(data) {
<<<<<<< HEAD
=======
        debugger
>>>>>>> cb3449c7abdec33ebb570838e237b06bcd10a740
        var param = {
            "method": 'getVillageCourseList',
            "villageId": villageId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if(result.response.length > 0) {
                        console.log(JSON.stringify(result.response));
                        document.querySelector('.time').innerHTML = !!result.response[0].classTime?
                            result.response[0].classTime:null;
                        document.querySelector('.location').innerHTML = !!result.response[0].classAddress?
                            result.response[0].classAddress:null;
                        document.querySelector('.img').src = !!result.response[0].backgroundImg?
                            result.response[0].backgroundImg:null;
                        document.querySelector('.class_name').innerHTML = !!result.response[0].courseName?
                            result.response[0].courseName:null;
                        document.querySelector('.ter_name').innerHTML = !!result.response[0].tearcherName?
                            result.response[0].tearcherName:null;
                        document.querySelector('.classTableA').style.display = 'none';
                        document.querySelector('.classTableB').style.display = 'block';
                    }else{
                        document.querySelector('.classTableA').style.display = 'block';
                        document.querySelector('.classTableB').style.display = 'none';
                    }

                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }
});