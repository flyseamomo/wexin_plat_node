/**
 * Created by Administrator on 2017/4/18.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')
const query = require('../../utils/query').query
const gm = require('gm').subClass({imageMagick: true})
const qiniu = require('../../common/upload')

module.exports = (ctx, next) => {
  return new Promise(async (resolve,reject)=>{
    let appid = ctx.request.body.appid
    let obj = ctx.request.body.obj
    let postUrl = ctx.request.body.postUrl
    let logo = ctx.request.body.logo
    console.log('body', ctx.request.body)
    let authorizer_access_token = await Authorizer_access_token(appid)

    let result = await request('POST', 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + authorizer_access_token).send(obj)
    result = JSON.parse(result.text)
    console.log('body',result)
    let ticket = encodeURIComponent(result.ticket)
    let qrcode_url = await request('GET', 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket)

    let url
    let get = async(err, buffer) => {
      if (err) console.log('err', err)
      else {
        url = await qiniu(buffer,null)
        resolve({url:url,ticket:ticket})
        let scene_str = obj.action_info.scene.scene_id ? obj.action_info.scene.scene_id : obj.action_info.scene.scene_str
        console.log('scene_str', scene_str)
        let opt = {
          appid: appid,
          postUrl: postUrl,
          scene_str: scene_str,
          url: url.url,
          creatAt: new Date().getTime(),
          ticket:ticket
        }
        let qr_result = await query('INSERT INTO qrcode SET ?', opt)
        console.log('qrcode_creat', qr_result)
      }
    }
    if(logo){
      let option = 'image Over 155,155 120,120 ' + '"' + logo + '"'
      console.log('option',option)
      gm(qrcode_url.body).resize(430).draw(option).draw('image Over 0,0 430,430 "http://img.diandianys.com/qrcode_top.png"')
        .toBuffer('PNG',get)
    }else{
      gm(qrcode_url.body).resize(430).toBuffer('PNG', get)
    }
  }).then((data)=>{
    console.log('data',data)
    ctx.body = data
  })
}