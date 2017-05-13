/**
 * Created by Administrator on 2017/4/7.
 */
const request = require('superagent')
const Authorizer_access_token = require('../../common/authorizer_access_token')
const upload = require('../../common/upload')
const pipeline = require('../../common/pipeline')
const http = require('http')
const fs = require('fs')

module.exports = (ctx,next)=>{
  return new Promise(async(resolve, reject)=> {
    console.log('body',ctx.request.body)
    let appid = ctx.request.body.appid
    let mediaId = ctx.request.body.mediaId
    let type = ctx.request.body.type
    if(appid&&mediaId){
      let authorizer_access_token = await Authorizer_access_token(appid)

      http.get('http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + authorizer_access_token + '&media_id=' + mediaId, function(res) {
        var size = 0
        var chunks = []
        res.on('data', function(chunk){
          size += chunk.length
          chunks.push(chunk)
        });
        res.on('end', async()=>{
          var data = Buffer.concat(chunks, size)
          let filename = 'A_' + new Buffer(String(Math.round(new Date().getTime()/1000))).toString('base64') + new Buffer(String(Math.round(Math.random()*100))).toString('base64')
          let filetype = res.headers['content-type'].substring(res.headers['content-type'].indexOf('/')+1,res.headers['content-type'].length)
          if(filetype == 'amr'){
            //var data = Buffer.concat(chunks, size)
            // let out = fs.createWriteStream(__dirname + '/public' + filename)
            // out.write(data)
            // out.end(()=>console.log('end'))
            let url = await upload(data,filename + '.amr')
            let pipe = await pipeline(url.key,filename + '.aac')
            resolve('http://img.diandianys.com/'+ filename + '.aac')
          }else {
            let url = await upload(data,filename + '.' + filetype)
            resolve('http://img.diandianys.com/'+ filename + '.' + filetype)
          }
        });
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
      // let result = await request('GET','http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + authorizer_access_token + '&media_id=' + mediaId).buffer()
      // //console.log('result',result)
      // let data = new Buffer(result.text.toString())
      // console.log('data',data)

      //console.log('result',result)

      // if(type == 'audio'){

      // }else resolve(url.url)
    }else resolve('appid和mediaId不可为空')
  }).then((data)=>{
    console.log('data',data)
    ctx.body = data
  })
}