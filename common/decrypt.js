/**
 * Created by Administrator on 2017/4/14.
 */
const crypto = require('crypto')

let PKCS7Decoder = (buff)=> {
  var pad = buff[buff.length - 1]

  if (pad < 1 || pad > 32) {
    pad = 0
  }
  return buff.slice(0, buff.length - pad)
}

module.exports = (content) => {
  var aesCipher = crypto.createDecipheriv("aes-256-cbc", this.aesKey, this.iv)
  aesCipher.setAutoPadding(false)
  var decipheredBuff = Buffer.concat([aesCipher.update(str, 'base64'), aesCipher.final()])

  decipheredBuff = PKCS7Decoder(decipheredBuff)

  var len_netOrder_corpid = decipheredBuff.slice(16)

  var msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0)
  //recoverNetworkBytesOrder(len_netOrder_corpid.slice(0, 4));

  var result = len_netOrder_corpid.slice(4, msg_len + 4).toString()

  var appId = len_netOrder_corpid.slice(msg_len + 4).toString()

  if (appId != this.appID)throw new Error('appId is invalid')

  return result
}