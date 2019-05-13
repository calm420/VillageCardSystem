$(function () {

    var article = {};

    var classId = 5447;
    article.attacheMents = [];
    InitializePage();
    var schoolId = WebServiceUtil.GetQueryString("schoolId");
    var font = WebServiceUtil.GetQueryString('font');
    $('html').css('font-size', font);
    classId = WebServiceUtil.GetQueryString("clazzId");
    var skin = "skin_default";

    /**
     * 时间戳转年月日
     * @param nS
     * @returns {string}
     */
    formatYMD = function (nS) {
        var da = new Date(parseInt(nS));
        var year = da.getFullYear();
        var month = da.getMonth() + 1;
        var date = da.getDate();
        var ymdStr = [year, month, date].join('-');
        return ymdStr;
    };

    //监听接受消息
    window.addEventListener('message', function (e) {
        var commandInfo = JSON.parse(e.data);
        if (commandInfo.command == "setSkin") {
            if (schoolId == commandInfo.data.schoolId) {
                skin = commandInfo.data.skinName;
                document.getElementsByName("applicationDiv")[0].id = skin;
            }
        }
    })

    //跳转蚁巢作业
    $('#toHomeWorkModule').on('click', function () {

        var data = {
            method: 'openNewPage',
            url: "application/homeworkModule/index.html?classId=" + classId + "&skin=" + skin + "&font=" +font,
        };
        window.parent.postMessage(JSON.stringify(data), '*');
    });

    //跳转步数
    $('#toStep').on('click', function () {

        var data = {
            method: 'openNewPage',
            url: "application/healthStep/index.html?classId=" + classId + "&healthType=step&skin=" + skin+ "&font=" +font,
        };

        window.parent.postMessage(JSON.stringify(data), '*');

    });


    //跳转卡路里
    $('#toCalories').on('click', function () {

        var data = {
            method: 'openNewPage',
            url: "application/healthStep/index.html?classId=" + classId + "&healthType=calories&skin=" + skin+ "&font=" +font,
        };

        window.parent.postMessage(JSON.stringify(data), '*');

    });

    //跳转早到之星
    $('#toExcellentStu').on('click', function () {
        var data = {
            method: 'openNewPage',
            url: "application/excellentStu/index.html?clazzId=" + classId + "&skin=" + skin + "&font=" + font,
        };
        window.parent.postMessage(JSON.stringify(data), '*');
    });


    //跳转家校
    $('#toSchoolHome').on('click', function () {
        var data = {
            method: 'gotoNFCbyKK',
        };

        Bridge.callHandler(data, null, function (error) {

        });
    });


    //跳转管理员登录页面
    $('#toAdmin').on('click', function () {
        var data = {
            method: 'adminentrance',
        };
        console.log(data, "data")
        Bridge.callHandler(data, null, function (error) {

        });
    });

    $('#timeCheck').on('click', function () {
        var data = {
            method: 'timeCheck',
        };
        console.log(data, "data")
        Bridge.callHandler(data, null, function (error) {

        });
    })


    //初始化页面元素
    function InitializePage() {

    }

});