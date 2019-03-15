/**
 * 本节考勤
 */
var totalCount=0;
var totalStudent=new Array();
var simpleMs;
$(document).ready(function(){
    init();
});
function init(){
    var locationHref = decodeURI(window.location.href);
    var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
    var searchArray = locationSearch.split("&");
    var classTableId = searchArray[0].split('=')[1];
    getStudentByCourseTableItem(classTableId);
    openTimeInterVal(classTableId);

    var skin =WebServiceUtil.GetQueryString("skin");
    document.getElementsByName("courseAttendanceDetailDiv")[0].id=skin;
    var font = WebServiceUtil.GetQueryString('font');
    $('html').css('font-size', font);
    simpleMs = new SimpleConnection();
    simpleMs.connect();
    simpleListener();
}

function simpleListener() {
    simpleMs.msgWsListener = {
        onError: function (errorMsg) {
            // Toast.fail(errorMsg)
        }, onWarn: function (warnMsg) {
            // Toast.fail(warnMsg)
        }, onMessage: function (info) {
            console.log("info",info);
            if(info.command=="refreshClassCardPage"){
                goHomePage();
            }
        }
    }
}

function openTimeInterVal(classTableId){
    if(timer > 0){
        clearInterval(timer);
        timer = -1;
     }
    //开启定时器获取实到人数
    timer = setInterval(function () {
       getBraceletAttend(classTableId);
    }, 10000)
}
function goHomePage(){
    var data = {
        method: 'finish',
    };

    Bridge.callHandler(data, null, function (error) {
        window.history.back(-1);
    });

}
function getBraceletAttend(classTableId){
    var param = {
        "method": 'getBraceletAttendContainLate',
        "cid": classTableId
    };
    WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
        onResponse: function (result) {
            if (result.response) {
                var response=result.response;
                getBraceletAttendHandle(response);
            }
        },
        onError: function (error) {
            // message.error(error);
        }
    });
}
function getBraceletAttendHandle(response){
    // $("#imageTip"+157775).show();
    // $("#signTip"+157775).remove();
    $("#noAttendCount").text(totalCount-response.length);
    if(response==null||response.length==0){
        return
    }
    var lateCount=0;
    for (var i = 0; i < response.length; i++) {
        var user=response[i].user;
        var isLate=response[i].isLate;
        if(isLate==true){
            lateCount++;
        }
        var punchTime=response[i].punchTime;
       for(var j=0;j<totalStudent.length;j++){
           if(user.colUid==totalStudent[j]){
               if(isLate==true){
                   $("#signTip"+user.colUid).addClass("signIcon-blue");
                   $("#signTip"+user.colUid).text(punchTime);
               }else{
                   $("#imageTip"+user.colUid).show();
                   $("#signTip"+user.colUid).remove();
               }

           }
       }
    }
    $("#lateCount").text(lateCount);
}
function getStudentByCourseTableItem(classTableId){
    var param = {
        "method": 'getStudentByCourseTableItem',
        "id": classTableId
    };
    WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
        onResponse: function (result) {
            if (result.response) {
                var response=result.response;
                getStudentByCourseTableItemHandle(response,classTableId);
            }
        },
        onError: function (error) {
            // message.error(error);
        }
    });
    // $.post(url, {
    //     params: JSON.stringify(param)
    // }, function (result, status) {
    //     if (status == "success") {
    //         var response=result.response;
    //         getStudentByCourseTableItemHandle(response,classTableId);
    //     }
    // }, "json");
}
function getStudentByCourseTableItemHandle(response,classTableId){
    if(response==null||response.length==0){
        return
    }
    for (var i = 0; i < response.length; i++) {
        var user=response[i];
        var template = $("#student_template");
        template.find("#student_name").text(user.userName);
        template.find("#student_avatar").attr("src", user.avatar);
        template.find(".signIcon_green").attr("id", "imageTip"+user.colUid);
        template.find(".signIcon").attr("id", "signTip"+user.colUid);
        $("#student_list_container").append(template.html());
        totalStudent.push(user.colUid);
        template.find(".signIcon_green").attr("id", "imageTip"+-1);
        template.find(".signIcon").attr("id", "signTip"+-1);

    }
    totalCount=response.length;
    $("#totalCount").text(response.length);
    getBraceletAttend(classTableId);
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