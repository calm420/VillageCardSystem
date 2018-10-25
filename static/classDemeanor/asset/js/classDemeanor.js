$(document).ready(function () {

    InitializePage();

    function initSwiper(){
        var mySwiper = new Swiper(".swiper-container",{
                autoplay:1000,
            loop:true,
            autoplayDisableOnInteraction:false,
            pagination:".swiper-pagination",
            paginationClickable:true,
            prevButton:".swiper-button-prev",
            nextButton:".swiper-button-next",
            effect:"flip"
        })
    }

    //监听接受消息
    window.addEventListener('message', (e) => {
        var res = JSON.parse(e.data);
        if (res.method == 'test') {
            console.log(res, '测试的postMessage');
        } else if (res.method == 'clearRichTestSign') {
            //清空编辑器内容
            window.location.reload();
        } else if (res.method == 'closeMask') {

        }
    })

    //初始化页面元素
    function InitializePage() {
        var clazzId = getQueryString("clazzId");
        getDutyInfo(clazzId);
    }

    function getDutyInfo(clazzId) {
        var param = {
            "method": 'getClassDemeanorInfo',
            "clazzId": clazzId,
            "type": 1
        };
        WebServiceUtil.requestLittleAntApi(true, JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == "调用成功") {
                    var response = result.response;
                    if (response != null && response != undefined) {
                        if (response.length === 0) {
                        } else {
                            var classDemeanors = result.response;
                            classDemeanors.forEach(function (classDemeanor) {
                                if (classDemeanor.imagePath.substr(classDemeanor.imagePath.length - 3, 3) == 'mp4') {
                                    /*var stuImgTag = <div className='videoDiv'>
                                        <i onClick={_this.videoOnClick.bind(this, classDemeanor)}></i>
                                    <video style={{width: '100%'}}
                                    src={classDemeanor.imagePath.split('?')[0]}>
                                </video>
                                    </div>*/
                                } else {

                                    /*if (classDemeanor.imagePath.indexOf('?') == -1) {
                                        var stuImgTag = <img style={{width: '100%', height: '100%'}}
                                        id={classDemeanor.id}
                                        src={classDemeanor.imagePath + '?' + WebServiceUtil.LARGE_IMG}/>;
                                    } else {
                                        var stuImgTag = <img style={{width: '100%', height: '100%'}}
                                        id={classDemeanor.id}
                                        src={classDemeanor.imagePath + '&' + WebServiceUtil.LARGE_IMG}/>;
                                    }*/
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

    /**
     * 获取地址栏参数
     * @param name
     * @returns {null}
     * @constructor
     */
    function getQueryString(parameterName){
        var reg = new RegExp("(^|&)"+ parameterName +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

});