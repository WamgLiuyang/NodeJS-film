const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MovieSchema = new schema({
    name: { //片名
        type: String,
        required: true,
        // unique: true,
    },
    director: [{ //导演
        type: String,
        required: true
    }],
    actors: [{ //演员
        type: String,
        required: true
    }],
    authors: [{ //编剧
        type: String,
        required: true
    }],
    aliases: [{ //别名
        type: String,
        required: true
    }],
    describe: { //剧情梗概
        type: String,
        required: true
    },
    score: { //豆瓣评分
        type: Number,
        required: true
    },
    types: [{ //类型
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'type'
    }],
    release: { //上映日期
        type: Date,
        required: true
    },
    countries: [{ //制片国家/地区 
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'country'
    }],
    duration: { //片长
        type: Number,
        required: true
    },
    covers: { //电影封面
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('movie', MovieSchema, 'movie');