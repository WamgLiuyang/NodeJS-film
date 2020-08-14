//引入路由
const koaRouter = require('koa-router');
const router = new koaRouter({ prefix: '/:resource' }); //接受传值 
const datalize = require('datalize');
const field = datalize.field;
//引入中间件
const { verifyToken } = require('../common/middleware');

// 添加验证
const validator = async (ctx, next) => {
    const resource = ctx.params.resource;
    if (resource === 'type' || resource === 'country') {
        return (await typeValidator(ctx, next));
    } else if (resource === 'movie') {
        return (await movieValidator(ctx, next));
    }
};

const typeValidator = datalize([
    field('name').trim().required().length(2)
]);

const movieValidator = datalize([
    field('name').trim().required().minLength(2, 10)
]);

//引入对应模版 中间件 对应前台访问接口
const getModels = async (ctx, next) => {
    const resource = ctx.params.resource;

    ctx.Model = require(`../models/${resource.charAt(0).toUpperCase() + resource.slice(1).toLowerCase()}`) //首字母大写 后面小写 统一格式
    await next();
};

//查询
router.get('/', getModels, async ctx => {
    const query = ctx.request.query, resource = ctx.params.resource;// 获取传值
    let { id, keyword } = query, status = 200, or = {};
    let date = {}, limit = parseInt(query.limit || 20), page = parseInt(query.page || 1);
    if (id && (typeof id === 'string') && (id.length > 0)) {
        try {
            date = await ctx.Model.findById(id);
        } catch (e) {
            date = e;
            status = 503;
        }
    } else {

        if (keyword && (typeof keyword === 'string') && (keyword.length > 0)) {
            const reg = new RegExp(keyword || '', 'i') //不区分大小写

            if (resource === 'type' || resource === 'country') {
                or = {
                    "$or": [
                        { name: { $regex: reg } },
                    ]
                }
            } else if (resource === 'movie') {
                or = {
                    "$or": [
                        { name: { $regex: reg } },
                        { director: { $regex: reg } },
                        { actors: { $regex: reg } },
                        { authors: { $regex: reg } },
                        { aliases: { $regex: reg } },
                    ]
                }
            }
        }
        try {
            const total = await ctx.Model.countDocuments(or);
            if (resource === 'movie') {
                require('../models/Type'); require('../models/Country');
                if (query.types) {
                    or.types = query.types || null;
                }
                if (query.countries) {
                    or.countries = query.countries || null;
                }
                date = await ctx.Model.find(or, { __v: false }).populate('types', { __v: false }).populate('countries', { __v: false }).skip((page - 1) * limit).limit(limit);
            } else {
                date = await ctx.Model.find(or, { __v: false }).skip((page - 1) * limit).limit(limit);
            }
            date = { date, total }
        } catch (e) {
            date = e;
            status = 503;
        }
    }
    ctx.status = status;
    ctx.body = date;
});

//新建
router.post('/', verifyToken, getModels, async ctx => {
    let date = '', status = 200;
    try {
        date = await new ctx.Model(ctx.request.body).save();
    } catch (e) {
        date = e;
        status = 503;
    }
    ctx.status = status;
    ctx.body = date;
});

//修改
router.put('/:id', verifyToken, validator, getModels, async ctx => {
    delete ctx.request.body.id;  //返回值是true
    const body = ctx.request.body;
    let id = ctx.params.id, status = 200, date = {};
    try {
        date = await ctx.Model.findByIdAndUpdate(id, body);
        if (!date) {
            status = 503;
            date = { error: 'id is not find' };
        }
    } catch (e) {
        date = e;
        status = 503;
    }
    ctx.status = status;
    ctx.body = date;
});

//删除
router.delete('/:id', verifyToken, getModels, async ctx => {
    let id = ctx.params.id, status = 200, date = {};
    try {
        date = await ctx.Model.findByIdAndDelete(id);
        if (!date) {
            status = 503;
            date = { error: 'id is not find' };
        }
    } catch (e) {
        date = e;
        status = 503;
    }
    ctx.status = status;
    ctx.body = date;
});

module.exports = router.routes();