/*
artist.js

- Still have to connect to mongodb
- Setup artist params (Idk wtf they are)

*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema definition
const artistSchema = new Schema({
    name: { type: String, required: true },
    test: { type: String }
});

//Creation of artists + use of schema
const Artist = mongoose.model('Artist', artistSchema);

//Allow use in other files
module.exports = Survey;