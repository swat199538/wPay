# pay-view
完整的支付前端页面和流程。

## build文件是完整的未压缩的，min是压缩过后的文件，项目请引入min文件夹里的。（请不要修改文件里的任何东西，完整的放到你的项目目录里）

## 快速使用

```javascript
<script src='http://yourURL/min/wPay.js'></script>

/*配置参数*/
<script>
    pay.config.wechatOrderPath = "你的创建订单后台地址";
    pay.config.wechatResultPath = "你的查询订单完成地址";
    pay.orderReturn = function (e) {
        //ajax请求下单接口执行的操作，e是服务端返回的数据，用户自行判断
        //下单是否成功，成功返回数据中的uri信息，失败返回false
    }
    pay.payResult = function (e){
        //ajax请求支付查询接口后执行，用户执行判断数据
        //已支付返回 true,未支付返回false
    }
    pay.endEvent = function () {
        //当整个支付流程完成后,会执行的函数
    };
    
    //显示支付界面
    //第一个参数是需要支付的金额
    //第二个参数是你想要往服务器提交的参数对象
    pay.show(money, {_token:'sdfa*&^2,x*71'});
</script>
```