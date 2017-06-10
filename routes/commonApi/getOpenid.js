/**
 * Created by Administrator on 2017/4/1.
 */
const getOpenid = require('../../fn/wechat/getOpenid')
const querystring = require("querystring")
const plat = require('../../config/constant')
const query = require('../../utils/query').query
const request = require('superagent')

module.exports = async (ctx,next)=>{
  //获取url参数的callback，即需要调用本接口的前端的回调地址
  let callback = querystring.parse(ctx.querystring).callback
  //获取url参数的wxid，即需要授权的appid
  let wxid = querystring.parse(ctx.querystring).wxid
  //获取url参数的openid，即需要授权的appid
  let code = querystring.parse(ctx.querystring).code
  //获取code后回调地址
  let url = encodeURIComponent('http://api.diandianyy.com/util/weixin/app/auth?callback=' + callback + '&wxid=' + wxid)
  if(code){
    console.log('code',code)
    //通过code获取openid及用户的access_token
    let obj = await getOpenid(code,wxid)
    let openid = obj.openid
    if(callback.indexOf('?')>0){
        callback = callback.replace('?','?openid='+openid + '&')
    }
    ctx.redirect(callback+'?openid='+openid)
    //获取用户基本信息
    let result = await request('GET','https://api.weixin.qq.com/sns/userinfo?access_token=' + obj.access_token + '&openid=' + obj.openid + '&lang=zh_CN')
    result = JSON.parse(result.text)
    console.log('result',result)
    //删除特权属性
    delete result.privilege
    //判断用户是否注册wechat_user
    let user = await query('SELECT * FROM wechat_user WHERE openid = ?', obj.openid)
    console.log('user',user)
    if (user.obj.length>0) {
      query('UPDATE wechat_user SET ? WHERE openid = ?',[result,obj.openid])
    }else query('INSERT INTO wechat_user SET ?',result)
  }else{
    ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+wxid+'&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid='+plat.appid+'#wechat_redirect')
  }
}