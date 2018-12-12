$(function () {
    var schoolId = getQueryString("schoolId");
    var clazzId = getQueryString("clazzId");
    var roomId = getQueryString("roomId");
    var skin = getQueryString("skin");
    var events=[];
    document.getElementsByName("historyScore")[0].id=skin;
    var simpleMs = new SimpleConnection();
    simpleMs.connect();

    InitializePage();

    //初始化页面元素
    function InitializePage() {
        simpleListener();
        $('#calendar').fullCalendar({
            defaultView: 'month',
            height: 'auto',
            header: {
                left: '',
                center: '',
                right: 'prev,title,next today'
            },
            displayEventTime:true,
            displayEventEnd:true,
            weekMode:"liquid",
            aspectRatio:2,
            allDaySlot:false,
            timeFormat: 'HH:mm',
            locale:'zh-cn',
            eventOrder:'index',
            viewRender:function (view) {//动态把数据查出，按照月份动态查询
                console.log(view.start._i,view.end._i);
                getHistoryMoralEducationInfo(view.start._i,view.end._i);
            },
            /*dayClick: function() {
                alert('a day has been clicked!');
            }*/
            /*events:function(start, end, callback){
                //prev上一月, next下一月等事件时调用
                console.log(start,end);
            }*/
        });
        $('#calendar').fullCalendar( 'removeEvents');
    }
    function getHistoryMoralEducationInfo(startTime,endTime) {
        var param = {
            "method": 'getHistoryMoralEducationInfo',
            "clazzId": clazzId,
            "startTime": startTime,
            "endTime": endTime,
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if(result.success==true && result.msg=="调用成功"){
                    $('#calendar').fullCalendar( 'removeEvents');
                    var response = result.response;
                    if(response != null && typeof(response)!=undefined){
                        for(var i=0;i<response.length;i++){
                            var scoreData = response[i];
                            drawCalendar(scoreData);
                        }
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
                $('body').html("查询出错:" + JSON.stringify(responseStr))
            }
        });
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
                    window.history.back(-1);
                }
            }
        }
    }

    /**
     * 绘制日期中的数据
     * @param scoreData
     * @param date
     */
    function drawCalendar(scoreData) {
        var isallDay=true;
        events.splice(0);
        var date = WebServiceUtil.formatYMD(scoreData.createTime);
        //总分
        var totalScoreItem={
            title : "总分： "+scoreData.totalScore,
            index:1,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "#fff",
        };
        events.push(totalScoreItem);

        //全校排名
        var schoolOrderItem={
            title : "全校排名： "+scoreData.schoolRank,
            index:2,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "#fff",
        };
        events.push(schoolOrderItem);

        //年级排名
        var gradeOrderItem={
            title : "年级排名： "+scoreData.clazzRank,
            index:3,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "#fff",
        };
        events.push(gradeOrderItem);

        //礼仪
        var etiquetteItem={
            title : "礼仪： "+scoreData.politeness,
            index:4,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "#fff",
        };
        events.push(etiquetteItem);

        //健康
        var healthyItem={
            title : "健康： "+scoreData.health,
            index:5,
            start : date,
            className : "event-bar",
            allDay :  isallDay,
            end : date,
            backgroundColor : "#fff",
        };
        events.push(healthyItem);

        $('#calendar').fullCalendar( 'addEventSource', events );
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
        if (r != null) return unescape(r[2]); return null;
    }

    $('#historyGoBack').on('click',function(){
        console.log('返回首页');
        var data = {
            method: 'finish',
        };
        Bridge.callHandler(data, null, function (error) {
            window.history.back(-1);
        });

    })

    /**
     * getTimeFormat时间戳转换格式
     */
    getTimeFormat=function(t) {
        var _time = new Date(t);
        // var   year=_time.getFullYear();//年
        var month = (_time.getMonth() + 1) < 10 ? ("0" + (_time.getMonth() + 1)) : (_time.getMonth() + 1);//月
        var date = _time.getDate() < 10 ? "0" + _time.getDate() : _time.getDate();//日
        var hour = _time.getHours() < 10 ? "0" + _time.getHours() : _time.getHours();//时
        var minute = _time.getMinutes() < 10 ? "0" + _time.getMinutes() : _time.getMinutes();//分
        // var   second=_time.getSeconds();//秒
        return month + "/" + date + " " + hour + ":" + minute;
    }

})