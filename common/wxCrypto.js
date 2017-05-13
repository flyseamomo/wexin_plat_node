/**
 * Created by Administrator on 2017/2/9.
 */
const crypto = require('crypto')
const XMLParser = require('xml2js')
const thunkify = require('thunkify')
const parseXML = thunkify(XMLParser.parseString)
const buildXML = new XMLParser.Builder({rootName:'xml',cdata:true,headless:true,renderOpts :{indent:' ',pretty:'true'}})
const plat = require('../config/constant')

// please decode the url before initializing this function
function wxCrypto(token,appID, encodingAESKey) {
    this.token = token
    this.appID = appID
    this.aesKey = new Buffer(encodingAESKey + '=', 'base64')
    this.iv = this.aesKey.slice(0, 16)
}

wxCrypto.prototype.decryptMsg = async (msgSignature, timestamp, nonce, data)=> {
    let msg_encrypt = data.Encrypt
    //if(data.ToUserName!=this.appID)throw new Error("ToUserName is invalid");
    if (this.getSignature(timestamp, nonce, msg_encrypt) != msgSignature)throw new Error('msgSignature is not invalid')
    let decryptedMessage = this.decrypt(msg_encrypt)
    return await parseXML(decryptedMessage,{explicitArray:false})
}

wxCrypto.prototype.encryptMsg = (replyMsg,opts)=> {
    let result = {}
    let options = opts||{}
    result.Encrypt = this.encrypt(replyMsg)
    result.Nonce = options.nonce || parseInt((Math.random() * 100000000000), 10)
    result.TimeStamp = options.timestamp || new Date().getTime()
    result.MsgSignature = this.getSignature(result.TimeStamp, result.Nonce, result.Encrypt)
    return buildXML.buildObject(result)
}

wxCrypto.prototype.encrypt = (xmlMsg)=> {
    var random16 = crypto.pseudoRandomBytes(16)
    var msg = new Buffer(xmlMsg)
    var msgLength = new Buffer(4)
    msgLength.writeUInt32BE(msg.length, 0)
    var corpId = new Buffer(this.appID)
    var raw_msg = Buffer.concat([random16,msgLength,msg ,corpId]);//randomString + msgLength + xmlMsg + this.corpID;
    //var encoded = PKCS7Encoder(raw_msg);
    var cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, this.iv)
    //cipher.setAutoPadding(false);
    var cipheredMsg = Buffer.concat([cipher.update(/*encoded*/raw_msg), cipher.final()])
    return cipheredMsg.toString('base64')
}

wxCrypto.prototype.decrypt = (str)=> {
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

wxCrypto.prototype.getSignature = (timestamp, nonce, encrypt)=> {
    var raw_signature = [this.token, timestamp, nonce, encrypt].sort().join('')

    var sha1 = crypto.createHash("sha1")
    sha1.update(raw_signature)

    return sha1.digest("hex")
}

function PKCS7Decoder(buff) {
    var pad = buff[buff.length - 1]

    if (pad < 1 || pad > 32) {
        pad = 0
    }
    return buff.slice(0, buff.length - pad)
}

function PKCS7Encoder(buff) {
    var blockSize = 32
    var strSize = buff.length
    var amountToPad = blockSize - (strSize % blockSize)
    var pad = new Buffer(amountToPad-1)
    pad.fill(String.fromCharCode(amountToPad))

    return Buffer.concat([buff, pad])
}

module.exports = new wxCrypto(plat.token,plat.appid,plat.key)