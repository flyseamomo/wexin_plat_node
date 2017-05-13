/**
 * Created by Administrator on 2017/3/14.
 */
const router = require('koa-router')()
const querystring = require("querystring")
const redis = require('../../utils/redis')
const request = require('superagent')
const Component_access_token = require('../../common/component_access_token')
const plat = require('../../config/constant')
const query = require('../../utils/query').query

const callback = async (ctx, next)=> {
  //取回调url中的auth_code
  let auth_code = querystring.parse(ctx.querystring).auth_code
  console.log('auth_code',auth_code)
  let component_access_token = await Component_access_token()
  
  //取授权公众号的authorization_info
  let result = await request('POST', 'https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=' + component_access_token).send({
    "component_appid": plat.appid ,
    "authorization_code": auth_code
  })
  result = JSON.parse(result.text).authorization_info
  console.log('authorizer',result)
  
  //将授权公众号的authorizer_access_token缓存到redis中
  redis.set('authorizer_access_token'+ result.authorizer_appid , result.authorizer_access_token)
  redis.expire('authorizer_access_token'+ result.authorizer_appid, 7000) //设置缓存时间略小于2小时
  
  //将授权公众号的authorizer_refresh_token缓存到redis中，用于刷新authorizer_access_token
  redis.set('authorizer_refresh_token'+ result.authorizer_appid , result.authorizer_refresh_token)
  
  //获取公众号的基本信息
  let info = await request('POST', 'https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=' + component_access_token).send({
    "component_appid": plat.appid ,
    "authorizer_appid": result.authorizer_appid
  })
  info = JSON.parse(info.text)
  let rows = {
    appid:result.authorizer_appid,
    mp_name:info.authorizer_info.nick_name,
    originalid:info.authorizer_info.user_name,
    auth_status:true,
    mp_type:info.authorizer_info.service_type_info.id,
    verify_type:info.authorizer_info.verify_type_info.id,
    mp_id:info.authorizer_info.alias,
    logo_url:info.authorizer_info.head_img,
    qrcode_url:info.authorizer_info.qrcode_url,
    business_info:JSON.stringify(info.authorizer_info.business_info),
    func_info:JSON.stringify(info.authorization_info.func_info),
    access_token:result.authorizer_access_token,
    refresh_token:result.authorizer_refresh_token,
    authorization_code:auth_code
  }
  
  console.log('rows',rows)
  let opt = await query('SELECT * FROM wechat_config WHERE appid = ?',result.authorizer_appid)
  if(opt.obj.length>0){
    await query('UPDATE wechat_config SET auth_status = 1 WHERE appid = ?',result.authorizer_appid)
  }else {
    await query('INSERT INTO wechat_config SET ?',rows)
  }
  console.log('opt',opt)
  ctx.body = 'success'
}

module.exports = callback