/**
 * Created by Administrator on 2017/4/14.
 */
const crypto = require('crypto')
const XMLParser = require('xml2js')
const buildXML = new XMLParser.Builder({rootName:'xml',cdata:true,headless:true,renderOpts :{indent:' ',pretty:'true'}})
const plat = require('../config/constant')

const key = new Buffer(plat.key + '=', 'base64')

let PKCS7Encoder = (buff) => {
  var blockSize = 32
  var strSize = buff.length
  var amountToPad = blockSize - (strSize % blockSize)
  var pad = new Buffer(amountToPad-1)
  pad.fill(String.fromCharCode(amountToPad))

  return Buffer.concat([buff, pad])
}
let getSignature = (timestamp, nonce, encrypt)=> {
  var raw_signature = [plat.token, timestamp, nonce, encrypt].sort().join('')

  var sha1 = crypto.createHash("sha1")
  sha1.update(raw_signature)

  return sha1.digest("hex")
}

let encrypt = (Message)=> {
  var random16 = crypto.pseudoRandomBytes(16)
  var xml = buildXML.buildObject(Message)
  console.log('message_xml',xml)
  var msg = new Buffer(xml)
  var msgLength = new Buffer(4)
  msgLength.writeUInt32BE(msg.length, 0)
  var corpId = new Buffer(plat.appid)
  var raw_msg = Buffer.concat([random16,msgLength,msg ,corpId]);
  //var encoded = PKCS7Encoder(raw_msg);
  var cipher = crypto.createCipheriv('aes-256-cbc', key , key.slice(0, 16))
  //cipher.setAutoPadding(false);
  var cipheredMsg = Buffer.concat([cipher.update(/*encoded*/raw_msg), cipher.final()])
  return cipheredMsg.toString('base64')
}

module.exports = (replyMsg)=> {
  let result = {}
  result.Encrypt = encrypt(replyMsg)
  result.Nonce = parseInt((Math.random() * 100000000000), 10)
  result.TimeStamp = parseInt(new Date().getTime()/1000)
  result.MsgSignature = getSignature(result.TimeStamp, result.Nonce, result.Encrypt)
  return buildXML.buildObject(result)
}