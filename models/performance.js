const uuid = require('uuid');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const {Types} = Schema;

const PerformanceSchema = new Schema({
    _id: {
        type: Schema.Types.String,
        default: uuid.v4
    },
    name: { 
        type: Types.String,
        required: true,
        index: true
    },
    artists: {
        type: [{type: Types.String, ref: 'Artist'}],
        index: true,
        default: []
    },
    notes: { 
        type: Types.String,
        index: true,
        default: ''
    },
    performanceDates: {
        type: [{type: Types.String, ref: 'PerformanceDate'}],
        index: true,
        default: []
    },
    deleted: {
        type: Types.Boolean,
        index: true,
        default: false
    }
}, {
    collection: 'performances',
    timestamps: true
});

module.exports = mongoose.model('Performance', PerformanceSchema);