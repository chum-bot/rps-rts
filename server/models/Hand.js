const mongoose = require('mongoose');
const Item = require('./Item.js')

//schema for the hand entity
//this is what the players are battling with

//they can wear three items: one glove, one bracelet, and one ring
//they have health (5? 6? a game design question to be playtested out later. YOU HAVE FOURTEEN DAYS WHAT DO YOU MEAN PLAYTESTED OUT LATER)
//they are stored in the recent battles log
const HandSchema = new mongoose.Schema({

    health: {
        type: Number,
        required: true,
        min: 0,
    },
    //mongoose documentation said i can shorten em like this
    //and none of these are required because hands can have no items
    glove: Item,
    bracelet: Item,
    ring: Item,
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

HandSchema.statics.toAPI = (doc) => ({
    winner: doc.winner,
    loser: doc.loser,
});

const HandModel = mongoose.model('Hand', HandSchema);

module.exports = HandModel;