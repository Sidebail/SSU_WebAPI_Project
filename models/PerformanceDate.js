const uuid = require('uuid');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const {Types} = Schema;

const PerformanceDateSchema = new Schema({
    _id: {
        type: Schema.Types.String,
        default: uuid.v4
    },
    startsAt: {
        type: Types.Date, 
        required: true,
        index: true
    },
    durationHours: {
        type: Types.Number, 
        index: true,
        default: 0.0
    },
    stages: {
        type: [{type: Types.String, ref: 'Stage'}],
        default: []
    },
    deleted: {
        type: Types.Boolean,
        index: true,
        default: false
    }
}, {
    collection: 'performance_dates',
    timestamps: true
});

module.exports = mongoose.model('PerformanceDate', PerformanceDateSchema);
