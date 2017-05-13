/**
 * Created by Administrator on 2017/4/22.
 */
const request = require('superagent')
const query = require('../../utils/query').query
const gm = require('gm').subClass({imageMagick: true})
const qiniu = require('../../common/upload')

module.exports = (ctx, next) => {
  return new Promise(async (resolve,reject)=>{
    let qrcodeUrl = ctx.request.body.qrcodeUrl
    let logo = ctx.request.body.logo
    console.log('qrcodeUrl',qrcodeUrl)
    console.log('logo',logo)

    let result = await request('get', qrcodeUrl)
    let option = 'image Over 155,155 120,120 ' + '"' + logo + '"'
    console.log('option',option)
    gm(result.body).resize(430).draw(option).draw('image Over 0,0 430,430 "http://img.diandianys.com/qrcode_top.png"')
      .toBuffer('PNG',async(err, buffer) => {
        if (err) console.log('err', err)
        else {
          let url = await qiniu(buffer,null)
          resolve(url.url)
        }
      })
  }).then((data)=>{
    console.log('data',data)
    ctx.body = data
  })
}