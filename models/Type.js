const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TypeSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (e) => {
                return e.length >= 2 && e.length <= 8;
            },
            message: '{VALUE} 字段长度必须大于等于2并且小于等于8'
        }
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('type', TypeSchema, 'type');