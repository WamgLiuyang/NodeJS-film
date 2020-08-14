const mongoose = require('mongoose');
const schema = mongoose.Schema;
//引入加密模块
const encrypt = require('../common/encrypt');

const UserSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (e) => {
                return /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(e);
            },
            message: '{VALUE} 邮箱验证不通过'
        },
    },
    password: {
        type: String,
        required: true,
        set(e) {
            return encrypt.aseEncode(e);
        }
    },
    type: {
        type: String,
        default: 'user' //user admin
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('user', UserSchema, 'user');