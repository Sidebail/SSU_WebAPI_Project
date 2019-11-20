/*
performance.js

- Performance model

*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema definition
const performanceSchema = new Schema({
    performanceId: {type: Number },
    name: { type: String, required: true },
    artist: {type: mongoose.Schema.Types.ObjectId, ref: 'artist'},
    showtime: {type: Date},
    notes: {type: String }
});

//Creation of stage + use of schema
const Performance = mongoose.model('Performance', performanceSchema);

//Allow use in other files
module.exports = Performance;