/*
stage.js

- Stage model

*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema definition
const stageSchema = new Schema({
    StageId: {type: Number },
    name: { type: String, required: true },
    size: {type: String },
    performance: {type: [mongoose.Schema.Types.ObjectId]},
    notes: {type: String },
    image: {type: String}
});

//Creation of stage + use of schema
const Stage = mongoose.model('Stage', stageSchema);

//Allow use in other files
module.exports = Stage;