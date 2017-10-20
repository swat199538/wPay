/**
 * Created by wangl on 2017/9/28.
 */
var pay = {
    config:{
        ajaxMethod:'GET',
        loopTime:2000,
        isLoad:false,
        haveWechat:true,
        wechatOrderPath:'',
        wechatResultPath:'',
        isLoadFont:false,
        haveAlipay:false,
        orderError:'下单出现错误，请重试'
    },
    ajaxIng:false,
    money:'',
    orderData:{},
    resultData:{},
    intervalId:'',
    //轮询到状态为支付成功关闭所有窗口和注销所有事件后执行。
    endEvent:function () {},
    //结果成功返回，微信的URI结果或者着支付宝的url，否则请返回false
    //格式如下{uri:xxxx,order:xxxx}
    orderReturn:function (e) {},
    //查询订单支付结果：已支付返回 true,未支付返回false
    payResult:function (e) {},
    loadCss:function () {
        if (pay.config.isLoadFont){
            $("head").append('<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">');
        }
        $("head").append('<link type="text/css" rel="stylesheet" href="'+pay.getCssUrl()+'"/>');
        pay.config.isLoad= true;
    },
    show:function (money, data) {
        if(!pay.config.isLoad){
            pay.loadCss();
        }
        pay.money = money;
        if (!pay.checkMoney()){
            layer.msg('只接受正整数的钞票,其它我们都不要！');
            return;
        }
        data['money'] = pay.money;
        pay.orderData = data;
        pay.open(pay.confirmView());
    },
    checkMoney:function () {
        return true;
    },
    open:function (dom) {
        $("body").append(dom);
        pay.registerAction();
    },
    registerAction:function () {
        $(".close-btn").one('click', pay.close)
        $(".confirm-charge-btn").one('click', pay.confirm);
        $(".pay-method-list li").on('click', function () {
            $(".pay-method-list li").removeClass('chosen');
            $(".pay-method-list li").addClass('un-chosen');
            $(this).removeClass('un-chosen');
            $(this).addClass('chosen');
        });
    },
    close:function () {
        $("#pay-view").remove();
        $(".pay-method-list li").off();
        clearInterval(pay.intervalId);
    },
    confirm:function () {
        //向服务器请求支付二维码
        var tool = pay.ensurePayTool();
        pay.close();

        switch (tool){
            case 'wechat':
                //通过ajax下单
                pay.ajax(pay.config.wechatOrderPath, pay.orderData, function (e) {
                    if (e == false){
                        layer.msg(pay.config.orderError);
                        return;
                    }
                    pay.open(pay.qrCodeView(e['uri']));
                    pay.resultData['order'] = e['order'];
                    pay.setLoop(pay.config.wechatResultPath, pay.resultData, function (n) {
                        if (n){
                            pay.close();
                            pay.open(pay.successView());
                            setTimeout(function () {
                                pay.close();
                                pay.endEvent();
                            }, 2000);
                        }
                    });
                }, 1);
                return;
            case 'alipay':
                layer.msg('开发中');
                return;
            default:
                layer.msg('请选择支付方式');
                return;
        }

    },
    ensurePayTool:function () {
        return $(".chosen").data("pay-tool");
    },
    ajax:function (url, data, action, type) {
        if (pay.ajaxIng){return}
        pay.ajaxIng = true;
        $.ajax({
            type:pay.config.ajaxMethod,
            url:url,
            data:data,
            success:function (e) {
                pay.ajaxIng = false;
                if (type == 1){
                    action(pay.orderReturn(e));
                }
                if (type == 2){
                    action(pay.payResult(e));
                }
            },
            dataType:"json"
        });
    },
    setLoop:function (url, data, action) {
        pay.intervalId = setInterval(function () {
            pay.ajax(url, data, action, 2)
        }, pay.config.loopTime);
    },
    confirmView:function () {
        var wechat = '';
        if (pay.config.haveWechat){
            wechat = '<li class="chosen" data-pay-tool="wechat" >'+
                '<i class="icon-ok hide"></i>'+
                '<img class="unchosen-icon" src="https://static.baydn.com/static/img/icon-wechat-pay-unchosen.png" alt="wechat pay">'+
                '<img class="chosen-icon" src="https://static.baydn.com/static/img/wechat-pay.png" alt="wechat pay">'+
                '<span>微信支付</span>'+
                '</li>';
        }

        var alipay = '';
        if (pay.config.haveAlipay){
            alipay = '<li class="un-chosen" data-pay-tool="alipay">'+
                '<i class="icon-ok hide"></i>'+
                '<img class="unchosen-icon" src="https://static.baydn.com/static/img/icon-alipay-unchosen.png" alt="alipay">'+
                '<img class="chosen-icon" src="https://static.baydn.com/static/img/icon-alipay.png" alt="alipay">'+
                '<span>支付宝支付</span>'+
                '</li>';
        }

        var dom = '<div id="pay-view" class="modal-container rmb-pay-modal-container hide" style="display: block;">'+
            '<div class="modal">'+
            '<p class="pay-title">确认支付</p>'+
            '<span class="close-btn icon-close">×</span>'+
            '<div class="pay-content">'+
            '<p class="shell-amount">充值<span>'+pay.money+'</span></p>'+
            '<p class="money-amount">付款金额：<span>￥'+pay.money+'</span></p>'+
            '<p class="pay-method-title">选择支付方式：</p>'+
            '<ul class="pay-method-list">'+wechat+alipay+ '</ul>'+
            '<a class="button confirm-charge-btn" data-pay-type="rmb">确认支付</a>'+
            '<a class="button cancel-btn close-btn">取消</a>'+
            '</div>'+
            '</div>'+
            '</div>';
        return dom;
    },
    qrCodeView:function (uri) {
        var url = "http://qr.liantu.com/api.php?text="+uri;
        var dom = '<div id="pay-view" class="modal-container wechat-pay-modal hide" style="display: block;">'+
            '<div class="modal">'+
            '<p class="pay-title">微信支付</p>'+
            '<span class="close-btn icon-close">×</span>'+
            '<div class="content">'+
            '<div class="left">'+
            '<p>打开微信扫一扫，扫描二维码支付</p>'+
            '<img class="wechat-pay-qrcode" data-img-src="data:image/png;base64," src="'+url+'">'+
            '<p>二维码有效时长为15分钟，</p>'+
            '<p>请尽快支付</p>'+
            '</div>'+
            '<div class="right">'+
            '<img src="https://static.baydn.com/static/img/wechat-pay-screen.png">'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        return dom;
    },
    successView:function () {
        var dom = '<div id="pay-view" class="modal-container wechat-pay-success-hint hide" style="display: block;">'+
            '<div class="modal">'+
            '<img src="https://static.baydn.com/static/img/wechat-pay-success.png">'+
            '<p>支付成功！2秒后自动关闭……</p>'+
            '</div>'+
            '</div>';
        return dom;
    },
    getCssUrl:function () {
        var list = document.getElementsByTagName('script');
        var patt = /(wPay\.js)/g;
        var src = '';
        for(var i in list){
            if (patt.test(list[i]['src'])){
                src = list[i]['src']
                break;
            }
        }
        return src.replace(/wPay\.js/g, 'css/wPay.css');
    }
}