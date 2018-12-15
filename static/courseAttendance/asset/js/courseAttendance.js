/**
 * 本节考勤
 */
var debug = true;
var url = debug ? "http://192.168.43.210:9006/Excoord_ApiServer/webservice" : "https://www.maaee.com/Excoord_For_Education/webservice";
var totalCount = 0;
var timerFlag = false;
var skin;
var timer;
$(document).ready(function () {
    init();

});

function init() {
    //getStudentByCourseTableItem(35)
    $("#classTableA").hide();
    $("#classTableB").show();
    var font = getQueryString('font')
    $('html').css('font-size', font)
    unbindGotoAttendDetail();
   // gotoAttendDetail(1);
}

// function gotoAttendDetail() {
//     parent.location.href="http://localhost:7091/courseAttendanceDetail/?classTableId=35";
// }
function gotoAttendDetail(classTableId) {
    $('#gotoAttendDetail').unbind("click");
    $('#gotoAttendDetail').click(function () {
        //parent.location.href="http://localhost:7091/courseAttendanceDetail/?classTableId="+classTableId;
        var data = {
            method: 'openNewPage',
            url: "courseAttendance/courseAttendanceDetail/index.html?classTableId=" + classTableId + "&skin=" + skin,
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
    var roomId = getQueryString("roomId");
    var schoolId = getQueryString("schoolId");
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
    } else if (data.command == 'braceletBoxConnect' && WebServiceUtil.isEmpty(data.data.classTableId) == false) {
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
    } else if (data.command == 'setSkin') {
        //设置皮肤
        if (schoolId == data.data.schoolId) {
            skin = data.data.skinName;
            document.getElementsByName("courseAttendanceDiv")[0].id = skin;
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
        "method": 'getBraceletAttend',
        "cid": classTableId
    };
    $.post(url, {
        params: JSON.stringify(param)
    }, function (result, status) {
        if (result.success == true) {
            var response = result.response;
            if (response != null) {
                $("#attendCount").text(response.length);
            } else {
                $("#attendCount").text(0);
            }
        } else {
            $("#attendCount").text(0);
        }
    }, "json");
}

function getStudentByCourseTableItem(classTableId) {
    var param = {
        "method": 'getStudentByCourseTableItem',
        "id": classTableId
    };
    $.post(url, {
        params: JSON.stringify(param)
    }, function (result, status) {
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
    }, "json");
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}