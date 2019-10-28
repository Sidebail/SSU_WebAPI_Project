/*
artist.js

- Artist Model

*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema definition
const artistSchema = new Schema({
    ArtistId: {type: Number },
    name: { type: String, required: true },
    stage: { type: String },
    duration: {type: String },
    notes: {type: String },
    image: {type: String} 
});

//Creation of artists + use of schema
const Artist = mongoose.model('Artist', artistSchema);

//Allow use in other files
module.exports = Artist;