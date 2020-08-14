//引入加密模块
const encrypt = require('./encrypt');
//引入对应模版
const User = require('../models/User');

const verifyToken = async (ctx, next) => {
    let token = ctx.request.headers.authorization
    if (token === '' || !token) {
        ctx.status = 401;
        ctx.body = { error: '请传token' };
    } else {
        token = token.split(" ").pop();
        try {
            token = encrypt.aseDecode(token).split("_");
            const id = token[0], password = token[1];
            try {
                date = await User.findById(id);
                if (encrypt.aseDecode(date.password).substring(0, 8) === password) {
                    ctx.userinfo = date;
                    await next();
                } else {
                    ctx.status = 401;
                    ctx.body = { error: 'token过期' };
                }
            } catch (e) {
                ctx.status = 503;
                ctx.body = e;
            }
        } catch (e) {
            ctx.status = 401;
            ctx.body = { error: 'token不正确' };
        }
    }
};

module.exports = { verifyToken };