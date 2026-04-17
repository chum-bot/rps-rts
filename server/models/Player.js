const mongoose = require('mongoose');
const Hand = require('./Hand.js');
//const Item = require('./Item.js');

//schema for the player entity
const PlayerSchema = new mongoose.Schema({

    account: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    //both hands are required because even if one dies i might add a consumable revive item at some point
    left: {
        type: Hand,
        required: true,
    },
    right: {
        type: Hand,
        required: true,
    },
    // reserve: {
    //     type: [Item], //i saw this syntax in the mongoose documentation so surely this just works
    // },
    //since there will be many Player objects for storage within Battle objects, i want to have an active designator for them
    //so i can get the player the user is currently playing as without conflicting with anything else
    active: {
        type: Boolean,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

PlayerSchema.statics.toAPI = (doc) => ({
    account: doc.account,
    left: doc.left,
    right: doc.right,
    active: doc.active,
    //reserve: doc.reserve,
});

const PlayerModel = mongoose.model('Player', PlayerSchema);

module.exports = PlayerModel;