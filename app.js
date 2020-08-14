const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-body');
const history = require('koa2-connect-history-api-fallback').historyApiFallback; // 在node 服务文件 app.js 中引入 koa-connect-history-api-fallback 注意： 该引用须在 const serve = require('koa-static'); 前
const path = require('path');
const koaStatic = require('koa-static');
const server = require('koa-static-server');
const mongoose = require('mongoose');
const datalize = require('datalize');
datalize.set('autoValidate', true);
const opn = require('opn');

//引入配置
const config = require('./common/config');

//实例化koa
const app = new koa(), router = new koaRouter({ prefix: '/api' });

//使用bodyParser中间键
app.use(bodyParser({ multipart: true }));// 允许上传多个文件

// 引入路由 配置路由地址
router.use(require('./routes/utils.js'), require('./routes/user.js'));

// datalize模块 自动错误处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof datalize.Error) {
            ctx.status = 400;
            ctx.body = err.toJSON();
        } else {
            ctx.status = 500;
            ctx.body = 'Internal server error';
        }
    }
});

//配置路由
app.use(router.routes()).use(router.allowedMethods());

//vue history模式 刷新404 koa 解决办法 一定要在 koaStatic 前用 写好重定义路径否则404
// app.use(history({ whiteList: ['/api', '/r', '/admin'] }));
app.use(history({
    index: '/index.html',
    whiteList: ['/api', '/r'],
    rewrites: [
        { from: /\/admin/, to: '/admin/index.html' }
    ]
}));


//设置静态页面
const staticPath = path.join(__dirname + '/public/web');
const adminPath = path.join(__dirname + '/public/admin');
app.use(koaStatic(staticPath));
app.use(server({ rootDir: adminPath, rootPath: '/admin' }))

//链接数据库
async function connectMongoDB() {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false)
    try {
        await mongoose.connect(config.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('mongodb connect success');
    } catch (e) {
        console.log(e);
    }
}

//设置端口号
const port = process.env.PORT || 3000;

async function main() {
    await connectMongoDB();
    app.listen(port, () => {
        console.log(`server run in \nhttp://localhost:${port}`);
    });
    // opn(`http://localhost:${port}`);
}

main();