/**
 * Created by Administrator on 2017/1/22.
 */
const qn = require('qn')

const client = qn.create({
    accessKey: 'uVk3SAmB958XatOC7iHFWsFaj_B3lKZrmm9P-F6f',
    secretKey: 'zxraRDN2AG8owYCfEILYXffMQ0kkpqUgOK4tx4WE',
    bucket: 'ddys',
    origin: 'http://img.diandianys.com',
    timeout: 3600000, // default rpc timeout: one hour, optional
})

module.exports = (b,key)=> {
    return new Promise((resolve, reject)=> {
      if(key){
        client.upload(b,{key:key},(err, result)=> {
          console.log(result)
          resolve(result)
          // {
          //   hash: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
          //   key: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
          //   url: 'http://qtestbucket.qiniudn.com/FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
          // }
        })
      }else{
        client.upload(b,(err, result)=> {
          console.log(result)
          resolve(result)
          // {
          //   hash: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
          //   key: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
          //   url: 'http://qtestbucket.qiniudn.com/FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
          // }
        })
      }
    })
}
