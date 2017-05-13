/**
 * Created by Administrator on 2017/4/1.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')
const crypto = require('crypto')
const redis = require('../../utils/redis')

module.exports = async (ctx,next)=>{
  let appid = ctx.request.body.appid
  console.log('appid',appid)
  let url = ctx.request.body.url
  console.log('url',url)
  let authorizer_access_token = await Authorizer_access_token(appid)
  let jsapi_ticket = await redis.get('jsapi_ticket' + appid)
  if(!jsapi_ticket) {
    let result = await request('GET','https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+authorizer_access_token+'&type=jsapi')
    result = JSON.parse(result.text)
    console.log('jssdk_result', result)
    jsapi_ticket = result.ticket
    redis.set('jsapi_ticket' + appid, result.ticket)
    redis.expire('jsapi_ticket' + appid, 7000)
  }
  let md5sum = crypto.createHash('md5')
  let ran = Math.round(Math.random()*1000) + ''
  md5sum.update(ran)
  let str = md5sum.digest('hex')
  let timestamp = parseInt(new Date().getTime()/1000)
  let string = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + str + '&timestamp=' + timestamp + '&url=' + url
  let sha1 = crypto.createHash('sha1')
  sha1.update(string)
  let sign = sha1.digest('hex')
  let opt = {
    appId:appid,
    timestamp:timestamp,
    nonceStr:str,
    signature:sign,
    jsApiList:["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","startRecord","stopRecord","onVoiceRecordEnd","playVoice","pauseVoice","stopVoice","onVoicePlayEnd","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage","downloadImage","translateVoice","getNetworkType","openLocation","getLocation","hideOptionMenu","showOptionMenu","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","closeWindow","scanQRCode","chooseWXPay","openProductSpecificView","addCard","chooseCard","openCard"]
  }
  ctx.body = opt
}