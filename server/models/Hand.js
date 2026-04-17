const mongoose = require('mongoose');
const Item = require('./Item.js')

//schema for the hand entity
//this is what the players are battling with

//they can wear three items: one glove, one bracelet, and one ring
//they have health (5? 6? a game design question to be playtested out later. YOU HAVE FOURTEEN DAYS FOR THE BASE GAME WHAT DO YOU MEAN PLAYTESTED OUT LATER)
//they are stored in the recent battles log
const HandSchema = new mongoose.Schema({

    health: {
        type: Number,
        required: true,
        min: 0,
    },
    //mongoose documentation said i can shorten em like this
    //and none of these are required because hands can have no items
    //meaning i can leave these when scoping out items
    glove: Item,
    bracelet: Item,
    ring: Item,
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

HandSchema.statics.toAPI = (doc) => ({
    health: doc.health,
    glove: doc.glove,
    bracelet: doc.bracelet,
    ring: doc.ring,
});

const HandModel = mongoose.model('Hand', HandSchema);

module.exports = HandModel;