//引入配置
const config = require('./config');
const crypto = require('crypto');
const key = Buffer.from(config.Key, 'utf8');
const iv = Buffer.from(config.iv, 'utf8');

// 创建加密算法
const aseEncode = (src) => {
    if (typeof src === 'object') {
        src = JSON.stringify(src)
    }
    let sign = '';
    // 如下方法使用指定的算法与密码来创建cipher对象
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    // 使用该对象的update方法来指定需要被加密的数据
    sign += cipher.update(String(src), 'utf8', 'hex');
    sign += cipher.final('hex');
    return sign;
}

// 创建解密算法
const aseDecode = (sign) => {
    /*
    该方法使用指定的算法与密码来创建 decipher对象, 第一个算法必须与加密数据时所使用的算法保持一致;
    第二个参数用于指定解密时所使用的密码，其参数值为一个二进制格式的字符串或一个Buffer对象，该密码同样必须与加密该数据时所使用的密码保持一致
   */
    let src = '';
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    /*
    第一个参数为一个Buffer对象或一个字符串，用于指定需要被解密的数据
    第二个参数用于指定被解密数据所使用的编码格式，可指定的参数值为 'hex', 'binary', 'base64'等，
    第三个参数用于指定输出解密数据时使用的编码格式，可选参数值为 'utf-8', 'ascii' 或 'binary';
   */
    src += cipher.update(sign, 'hex', 'utf8');
    src += cipher.final('utf8');
    try {
        return JSON.parse(src)
    } catch (e) {
        return src;
    }
};

// const obj = {username: '1670876483', password: 'wly15010414184', id: '24',date:new Date().getTime()};
// console.log(aseEncode(obj));
// console.log(aseDecode(aseEncode(obj)));

module.exports = { aseEncode, aseDecode };
