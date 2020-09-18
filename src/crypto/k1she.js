const MP = require('./mp.js')
const crypto = require('crypto')
const aesCmac = require('node-aes-cmac').aesCmac;

const KEY_UPDATE_ENC_C = '010153484500800000000000000000b0'
const KEY_UPDATE_MAC_C = '010253484500800000000000000000B0'


function KDF(k, constant) {
    var c = Buffer.concat([k, constant], k.length + constant.length)
    return MP(c)
}


function genM1M2M3(keyAuthId, keyAuthValue, keyId, keyValue, flag, cid, uid) {
    var bM1 = Buffer.alloc(16, 0)
    var bM2 = Buffer.alloc(32, 0)
    var bM4 = Buffer.alloc(32, 0)
    var k1 = KDF(keyAuthValue, Buffer.from(KEY_UPDATE_ENC_C, 'hex'))
    var k2 = KDF(keyAuthValue, Buffer.from(KEY_UPDATE_MAC_C, 'hex'))
    var k3 = KDF(keyValue, Buffer.from(KEY_UPDATE_ENC_C, 'hex'))
    var k4 = KDF(keyValue, Buffer.from(KEY_UPDATE_MAC_C, 'hex'))
    uid.copy(bM1)
    bM1[15] = (((keyId & 0x0f) << 4) | (keyAuthId & 0x0f))

    bM2.writeUInt32BE(((cid << 4) & 0xfffffff0), 0)
    var t = bM2.readUInt8(3)
    if (flag.WRITE_PROT) {
        t |= 0x8
    }
    if (flag.BOOT_PROT) {
        t |= 0x4
    }
    if (flag.DEBUG_PROT) {
        t |= 0x2
    }
    if (flag.KEY_USAGE) {
        t |= 0x1
    }
    bM2.writeUInt8(t, 3)
    t = 0
    if (flag.WILD_CARD) {
        t |= 0x80
    }
    if (flag.VERIFY_ONLY) {
        t |= 0x40
    }
    bM2.writeUInt8(t, 4)
    keyValue.copy(bM2, 16)
    //aes-cbc k1
    var aescbc = crypto.createCipheriv('aes-128-cbc', k1, Buffer.alloc(16, 0))
    bM2 = aescbc.update(bM2)
    aescbc.final()
    //cmac k2
    var bM3 = aesCmac(k2, Buffer.concat([bM1, bM2], bM1.length + bM2.length), { returnAsBuffer: true })
    //M4
    uid.copy(bM4)
    bM4[15] = (((keyId & 0x0f) << 4) | (keyAuthId & 0x0f))
    var bM4T = Buffer.alloc(16, 0)
    bM4T.writeUInt32BE(((cid << 4) & 0xfffffff0), 0)
    t = bM4T.readUInt8(3)
    t |= 0x08
    bM4T.writeUInt8(t, 3)
    var aesecb = crypto.createCipheriv('aes-128-ecb', k3, null)
    var bM4T1 = aesecb.update(bM4T)
    aesecb.final()
    bM4T1.copy(bM4, 16)
    //m5
    var bM5 = aesCmac(k4, bM4, { returnAsBuffer: true })



    return {
        M1: bM1,
        M2: bM2,
        M3: bM3,
        M4: bM4,
        M5: bM5
    }
}

module.exports = genM1M2M3