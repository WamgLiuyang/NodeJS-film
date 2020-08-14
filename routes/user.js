//引入路由
const koaRouter = require('koa-router');
const router = new (koaRouter);
const mongoose = require('mongoose');
//引入对应模版
const User = require('../models/User');
//引入加密模块
const encrypt = require('../common/encrypt');
//引入中间件
// const { verifyToken } = require('../common/middleware');

//注册
router.post('/user/register', async ctx => {
    const body = ctx.request.body;
    const { username, password, type } = body;
    let date = '', status = 200;

    if (!(/(?!.*\s)(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}/.test(password))) {
        status = 500;
        date = { error: `${password} 密码复杂度太低，密码中必须包含字母、数字，至少8个字符，最多30个字符` };
    } else {
        let user = {
            username: username,
            password: password,
            type: type || 'user'
        }
        try {
            date = await new User(user).save();
            date = { msg: 'ok' }
        } catch (e) {
            status = 503;
            date = e;
        }
    }
    ctx.status = status;
    ctx.body = date;
});

//登录
router.post('/user/login', async ctx => {
    const body = ctx.request.body;
    const { username, password } = body;
    let date = '', status = 200;
    if (!username && username.length > 0) {
        status = 500;
        date = { error: `${username} 账号不能为空` };
    } else {
        try {
            date = await User.findOne({ username: username });
            if (!date) {
                status = 500;
                date = { error: `${username} 此账号不存在` };
            } else {
                if (password !== encrypt.aseDecode(date.password)) {
                    status = 500;
                    date = { error: `${password} 密码错误` };
                } else {
                    date = {
                        username: username,
                        type: date.type,
                        token: encrypt.aseEncode(`${date._id}_${password.substring(0, 8)}`)
                    }
                }
            }
        } catch (e) {
            status = 503;
            date = e;
        }
    }
    ctx.status = status;
    ctx.body = date;
});

// router.post('/getToken', verifyToken, async ctx => {
//     console.log(ctx.userinfo);
//     ctx.body = ctx.userinfo;
// });

module.exports = router.routes();