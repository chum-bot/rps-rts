const mongoose = require('mongoose');
const Player = require('./Player.js');

//schema for the battle entity
//this will be used to update the recent battles log that everybody will be able to see
//it would be cool if i had a replay system but... scope creep...

//so for my storage loop with this battle replay storing thing
//when a player runs up a game, an empty Player assigned to an Account will be created (meaning 2 accounts per game)
//each Player has a left and right Hand and an item reserve (Item[])
//when the game ends, this entity is populated with who won and who lost the battle
//and the ingame display will use all the info stored in the player
//all of these entities are then displayed in the recent battles log
const BattleSchema = new mongoose.Schema({

    winner: {
        //...i don't know how to save these as custom types.
        //he said how to but i forgoooooooot
        type: Player,
        //uhhhhh does that work?
        //i feel like it would no?
        required: true,
    },
    loser: {
        type: Player,
        required: true,
    },
    battleDate: {
        type: Date,
        default: Date.now,
    },
});

BattleSchema.statics.toAPI = (doc) => ({
    winner: doc.winner,
    loser: doc.loser,
    battleDate: doc.battleDate,
});

const BattleModel = mongoose.model('Battle', BattleSchema);

module.exports = BattleModel;