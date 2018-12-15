$(function(){
    var html = '';
    var type = WebServiceUtil.GetQueryString('healthType');
    var classId = WebServiceUtil.GetQueryString('classId');
    var skin = WebServiceUtil.GetQueryString("skin");
    console.log(skin,'skin');
    document.getElementsByName("helthStepDiv")[0].id= skin;
    var simpleMs = new SimpleConnection();
    simpleMs.connect();
    simpleListener();

    $('#typeTitle').text(type == 'step' ? '步数排行榜' : '卡路里排行榜');

    getBraceletSportStepByClazzId(classId);
    //根据班级获取卡路里和步数
    function getBraceletSportStepByClazzId(clazzId) {
        var param = {
            "method": 'getBraceletSportStepByClazzId',
            "clazzId": clazzId,
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(true,JSON.stringify(param), {
            onResponse: function(result) {
                console.log(result,'班级和卡路里');
                if (result.msg == '调用成功' || result.success) {
                    //数据为空
                    var res = result.response;
                    if(result.response.length <= 0){
                        $('#content').append("<div class='health_cont'>" +
                            "                        <div class='emptyPage_content'>" +
                            "                            <div class='empty_center'>" +
                            "                                <div class='emptyPage_icon emptyPage_publicImg'></div>" +
                            "                                <div class='emptyPage_text'>暂无数据</div>" +
                            "                            </div>" +
                            "                        </div>" +
                            "                    </div>")
                    }else{
                        for(var k in res){
                            console.log(res[k],"k")
                            var className = k == 0 ?'firstClass' : k == 1 ? 'secondClass' : k == 2 ? 'thirdClass' : 'otherClass';
                            var dataForm = type == 'step' ? res[k].sportStep : res[k].calorie.toFixed(2);
                            var dataType = type == 'step' ? '步' : '卡路里';
                            html += "<div class=\"photoItem\">\n" +
                                "                                <div class=\"imgDiv\">\n" +
                                "                                <img class=\"noomImg\" onerror=src=\"http://www.maaee.com:80/Excoord_For_Education/userPhoto/default_avatar.png\" src="+res[k].users.avatar+" alt=\"\"/>\n" +
                                "                                <div\n" +
                                "                            class="+className+" ></div>\n" +
                                "                            <div class=\"border_img\"></div>\n" +
                                "                                </div>\n" +
                                "                                <div class=\"studentName\">"+res[k].users.userName+"</div>\n" +
                                "                                <div\n" +
                                "                            class=\"step_number textOver\">"+dataForm+"<span\n" +
                                "                            class=\"step_number_s\">"+dataType+"</span></div>\n" +
                                "                            </div>"
                        }
                        $('#content').append(html);
                    }
                }
            },
            onError: function (error) {
                // Toast.info('获取列表失败', error);
            }
        });
    }

    function simpleListener() {
        simpleMs.msgWsListener = {
            onError: function (errorMsg) {
                // Toast.fail(errorMsg)
                console.log("errorMsg",errorMsg);
            }, onWarn: function (warnMsg) {
                console.log("warnMsg",warnMsg);
            }, onMessage: function (info) {
                console.log("info",info);
                if(info.command=="refreshClassCardPage"){
                    goHome();
                }
            }
        }
    }

    $('#historyGoBack').on('click',function(){
        goHome();
    })

    function goHome() {
        console.log('返回首页');
        var data = {
            method: 'finish',
        };
        Bridge.callHandler(data, null, function (error) {
            window.history.back(-1);
        });
    }

})