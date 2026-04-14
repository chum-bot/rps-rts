const mongoose = require('mongoose');
const Account = require('./Account.js');
const Hand = require('./Hand.js');
const Item = require('./Item.js');

//schema for the player entity
const PlayerSchema = new mongoose.Schema({

    account: {
        //type will be the account
        //DOES THIS WORK I HAVE NO IDEA
        type: Account,
        required: true,
    },
    //both hands are required because even if one dies i might add a consumable revive item at some point
    left: {
        //type Hand
        type: Hand,
        required: true,
    },
    right: {
        //type Hand
        type: Hand,
        required: true,
    },
    reserve: {
        type: [Item], //i saw this syntax in the mongoose documentation so surely this just works
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
    reserve: doc.reserve,
});

const PlayerModel = mongoose.model('Player', PlayerSchema);

module.exports = PlayerModel;