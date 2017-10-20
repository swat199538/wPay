# pay-view
完整的支付前端页面和流程。

### build文件是完整的未压缩的，min是压缩过后的文件，项目请引入min文件夹里的。（请不要修改文件里的任何东西，完整的放到你的项目目录里）test文件夹为demo


## 图片示例

![示例图片1](https://www.codingfish.xyz/wp-content/uploads/2017/10/示例1.jpg)

![示例图片2](https://www.codingfish.xyz/wp-content/uploads/2017/10/wPay%E7%A4%BA%E4%BE%8B2.jpg)




## 快速使用

```javascript
//引入 JS 文件
<script src='http://yourURL/min/wPay.js'></script>

/*配置参数*/

pay.config.wechatOrderPath = "你的创建微信订单后台地址";
pay.config.wechatResultPath = "你的查询微信订单完成地址";
pay.orderReturn = function (e) {
    //ajax请求下单接口执行的操作，e是服务端返回的数据，用户自行判断
    //下单是否成功，成功返回数据中的uri信息，失败返回false
}
pay.payResult = function (e){
    //ajax请求支付查询接口后执行，用自行数据
    //已支付返回 true,未支付返回false
}
pay.endEvent = function () {
    //当整个支付流程完成后,会执行的函数
};

//显示支付界面
//第一个参数是需要支付的金额
//第二个参数是你想要往服务器提交的参数对象
pay.show(money, {_token:'sdfa*&^2,x*71'});

/*其它一下配置文件，（要在show方法执行之前设置）*/

//设置ajax访问采用的方式(默认GET)
pay.config.ajaxMethod = 'POST';

//设置创建完成订单后，询问订单支付状态间隔时间(默认2000)
pay.config.loopTime = 3000;

//设置是否显示微信二维码支付
pay.config.haveWechat = false;

//设置是否显示支付宝支付(暂时还未完成，请不要使用)
pay.config.haveAlipay = true;

//是否加载字体,如果微信和支付宝选中的时候没有打勾请设置此值
pay.config.isLoadFont = true;

//创建订单出现错时的提示
pay.config.orderError = "创建订单失败了呢。";


```