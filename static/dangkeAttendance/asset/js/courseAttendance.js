/**
 * 本节考勤
 */
var timerFlag = false;
var skin = "skin_default";
var timer;
var font = WebServiceUtil.GetQueryString('font');
$(document).ready(function () {
    init();

});

function init() {
    $("#classTableA").hide();
    $("#classTableB").show();
    var font = WebServiceUtil.GetQueryString('font');
    $('html').css('font-size', font);
    unbindGotoAttendDetail();
}

function gotoAttendDetail(classTableId) {
    $('#gotoAttendDetail').unbind("click");
    $('#gotoAttendDetail').click(function () {
        var data = {
            method: 'openNewPage',
            url: "courseAttendance/courseAttendanceDetail/index.html?classTableId=" + classTableId + "&skin=" + skin + "&font=" + font,
        };
        window.parent.postMessage(JSON.stringify(data), '*');
    })
}

function unbindGotoAttendDetail() {
    $('#gotoAttendDetail').unbind("click");
    $('#gotoAttendDetail').click(function () {
        UiUtils.toast("还没上课呢...");
    })
}

function checkCourseOpenHandle(data) {
    var roomId = WebServiceUtil.GetQueryString("roomId");
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    if (data.command == 'brand_class_open') {
        var classTableId = data.data.classTableId;
        
        //获取应到人数
        if (roomId == data.data.classroomId) {
            gotoAttendDetail(classTableId);
            $("#classTableA").show();
            $("#classTableB").hide();
            getStudentByCourseTableItem(classTableId);
            if (!timerFlag) {
                this.openTimeInterVal(classTableId);
            }
        }
    } else if (data.command == 'brand_class_close') {
        if (roomId == data.data.classroomId) {
            unbindGotoAttendDetail();
            $("#classTableA").hide();
            $("#classTableB").show();
            clearInterval(timer)
            timerFlag = false;
        }
    } else if (data.command == 'braceletBoxConnect') {
        if(!WebServiceUtil.isEmpty(data.data.classTableId)){
            //重连开课
            if (roomId == data.data.classroomId) {
                $("#classTableA").show();
                $("#classTableB").hide();
                this.getStudentByCourseTableItem(data.data.classTableId);
                gotoAttendDetail(data.data.classTableId);
                if (!timerFlag) {
                    this.openTimeInterVal(data.data.classTableId);
                }
            }
        }else{
            unbindGotoAttendDetail();
            $("#classTableA").hide();
            $("#classTableB").show();
            clearInterval(timer);
            timerFlag = false;
        }

    } else if (data.command == 'setSkin') {
        //设置皮肤
        if (schoolId == data.data.schoolId) {
            skin = data.data.skinName;
            // document.getElementsByName("courseAttendanceDiv")[0].id = skin;
        }
    }

}

function openTimeInterVal(classTableId) {
    if(timer > 0){
       clearInterval(timer);
       timer = -1;
    }
    //开启定时器获取实到人数
    timer = setInterval(function () {
        getBraceletAttend(classTableId);
    }, 10000)
}

function getBraceletAttend(classTableId) {
    var param = {
        "method": 'getBraceletAttendContainLate',
        "cid": classTableId
    };
    WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
        onResponse: function (result) {
            if (result.success == true) {
                var response = result.response;
                var lateCount=0;
                if (response != null) {
                    $("#attendCount").text(response.length);
                    for(var i=0;i<response.length;i++){
                        var isLate=response[i].isLate;
                        if(isLate==true){
                            lateCount++;
                        }
                    }
                    $("#lateCount").text(lateCount);
                } else {
                    $("#attendCount").text(0);
                    $("#lateCount").text(0);
                }
            } else {
                $("#attendCount").text(0);
                $("#lateCount").text(0);
            }
        },
        onError: function (error) {
            // message.error(error);
        }
    });
}

function getStudentByCourseTableItem(classTableId) {
    var param = {
        "method": 'getStudentByCourseTableItem',
        "id": classTableId
    };
    WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
        onResponse: function (result) {
            if (result.success == true) {
                var response = result.response;
                if (response != null) {
                    $("#totalCount").text(response.length);
                } else {
                    $("#totalCount").text(0);
                }
            } else {
                $("#totalCount").text(0);
            }
        },
        onError: function (error) {
            // message.error(error);
        }
    });
}

function sendMessageTo(data) {
    window.parent.postMessage(JSON.stringify(data), '*');
}

//监听接受消息
window.addEventListener('message', function (e) {
    // console.log(e);
    var res = JSON.parse(e.data);
    checkCourseOpenHandle(res);
})