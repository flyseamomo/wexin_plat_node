/**
 * Created by Administrator on 2017/4/19.
 */
const qiniu = require('qiniu')
qiniu.conf.ACCESS_KEY = 'uVk3SAmB958XatOC7iHFWsFaj_B3lKZrmm9P-F6f'
qiniu.conf.SECRET_KEY = 'zxraRDN2AG8owYCfEILYXffMQ0kkpqUgOK4tx4WE'
// qiniu.conf.RS_HOST = 'http://img.diandianys.com'
const bucket = 'ddys'
let fops = 'avthumb/aac/ab/128k/ar/44100/acodec/libfaac'
let saveas_key
let opts = {
  pipeline: 'ddysmps',
  notifyURL:'www.baidu.com'
}

module.exports = (key,saves_key) => {
  return new Promise((resolve, reject) => {
    console.log('key', key)
    saveas_key = qiniu.util.urlsafeBase64Encode(bucket + ':' + saves_key)
    fops = fops + '|saveas/' + saveas_key
    qiniu.fop.pfop(bucket, key, fops, opts, function (err, ret) {
      if (!err) {
        // 上传成功， 处理返回值
        console.log('ret', ret)
        resolve(ret)
        // console.log('curl '+'http://api.qiniu.com/status/get/prefop?id='+ret.persistentId);
      } else {
        // 上传失败， 处理返回代码
        console.log(err)
      }
    })
  })
}
