const uuid = require('uuid');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const {Types} = Schema;

const ArtistSchema = new Schema({
    _id: {
        type: Schema.Types.String,
        default: uuid.v4
    },
    name: { 
        type: Types.String, 
        required: true 
    },
    notes: { 
        type: Types.String,
        default: '' 
    },
    image: { 
        type: Types.String,
        default: null
    },
    deleted: {
        type: Types.Boolean,
        index: true,
        default: false
    }
}, {
    collection: 'artists',
    timestamps: true
});

module.exports = mongoose.model('Artist', ArtistSchema);