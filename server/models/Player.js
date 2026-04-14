const mongoose = require('mongoose');

//schema for the player entity
const PlayerSchema = new mongoose.Schema({

    account: {
        //type will be the account
    },
    left: {
        //type will be the hand
    },
    right: {
        //type will be the hand
    },
    reserve: {
        //type will be an array of the items you get (i'd have to make an Item thing...)
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