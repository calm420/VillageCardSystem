$(document).ready(function () {
    InitializePage();
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    var clazzId = WebServiceUtil.GetQueryString("clazzId");
    var font = WebServiceUtil.GetQueryString('font')
    var vertical = WebServiceUtil.GetQueryString('vertical')
    $('html').css('font-size', font)

    //监听接受消息
    window.addEventListener('message',function (e) {
        var commandInfo = JSON.parse(e.data);
        if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                var skin = commandInfo.data.skinName;
                document.getElementsByName("studentOnDutyDiv")[0].id = skin;
            }
        }else if (commandInfo.command == "studentDuty") {
            if (clazzId == commandInfo.data.cid) {
                getDutyInfo(clazzId);
            }
        }
    })

    //初始化页面元素
    function InitializePage() {
        var clazzId = WebServiceUtil.GetQueryString("clazzId");
        getDutyInfo(clazzId);
        setTimeout(function () {
            if(!!vertical) {
                $('.studentOnDuty_list').width('2.73rem')
            }
        },1000)
    }

    function getDutyInfo(clazzId) {
        var param = {
            "method": 'getClassBrandStudentDutyByToday',
            "clazzId": clazzId,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                var weekOfTody = new Date().getDay();
                if(weekOfTody == 0){
                    weekOfTody = 7;
                }
                console.log(weekOfTody,"week")
                $("#todyDuty")[0].innerHTML="";
                $("#nextDuty")[0].innerHTML="";
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                        } else {
                            var clazzDutyList = result.response;
                            clazzDutyList.forEach(function (clazzDuty) {
                                var users = clazzDuty.users;
                                var clazzDutyWeek = clazzDuty.week;
                                if (WebServiceUtil.isEmpty(users) == false) {
                                    users.forEach(function (student) {
                                        if (student != null && student != undefined) {
                                            var stuName = student.userName;
                                            var stuImgTag = "<li class='studentOnDuty_list'><div class='studentOnDuty_face'><img class='studentOnDuty_face' src=" + student.avatar + "></div><div class='home_contfont text_hidden studentOnDuty_name'>" + stuName + "</div></li>";
                                            if (clazzDutyWeek == weekOfTody) {
                                                var currentInner = $("#todyDuty")[0].innerHTML + stuImgTag;
                                                $("#todyDuty")[0].innerHTML = currentInner;
                                            } else {
                                                var currentInner = $("#nextDuty")[0].innerHTML + stuImgTag;
                                                $("#nextDuty")[0].innerHTML = currentInner;
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

});