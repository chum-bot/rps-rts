const mongoose = require('mongoose');

//schema for the battle entity
//this will be used to update the account's battle log
//when they run up a game, an empty Player that is assigned to an Account will be created
//when the game ends, this entity is populated with the things that the Player had (their left/right hand loadout and their reserve)
//and that entity is then saved to the player's log (do i let them choose if they wanna save it? i think so but that's more work)
const BattleSchema = new mongoose.Schema({

    winner: {
        //type will be Player
    },
    loser: {
        //type will be Player
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

BattleSchema.statics.toAPI = (doc) => ({
    winner: doc.winner,
    loser: doc.loser,
    reserve: doc.reserve,
});

const BattleModel = mongoose.model('Battle', BattleSchema);

module.exports = BattleModel;