const uuid = require('uuid');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const {Types} = Schema;

const StageSchema = new Schema({
    _id: {
        type: Types.String,
        default: uuid.v4
    },
    name: { 
        type: Types.String, 
        required: true 
    },
    size: {
        type: Types.String, 
        default: ''
    },
    notes: {
        type: Types.String, 
        default: '' 
    },
    image: {
        type: Types.String,
        default: '' 
    },
    deleted: {
        type: Types.Boolean,
        index: true,
        default: false
    }
}, {
    collection: 'stages',
    timestamps: true
});

module.exports = mongoose.model('Stage', StageSchema);