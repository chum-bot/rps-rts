const mongoose = require('mongoose');
const emojiRegex = require('emoji-regex'); //emoji-regex npm library: https://www.npmjs.com/package/emoji-regex

//schema for the item entity
//now THIS is where the scope REALLY creeps...
//they have an isConsumable tag for consumable and permanent items SCOPE CREEP...
//i might also give some items a duration SCOPE CREEP......
//they have a function as their effect i would imagine (baseline for a functioning item but EVEN THIS COULD BE SCOPE CREEP.........)
//they have a wearable that says what they are (glove bracelet ring, ez it's just an enum)

//i'm cutting this functionality for the project because of scope creep
//the code will stay tho, because i want to expand on this idea later
//i plan to make the initial rock paper scissors doubles game
//two hands, each with their own health, you can target each hand with rock paper or scissors
//because i feel like that would be fine and... doable... in the amount of time i have
//we'd need the account stuff and the profit model and the subset of users thing so i'll look at that but
//all these extra features gotta go
//completely scoping out that whole "prep phase" insanity for now, because that sounds like way too much to complete and polish in... twelve days as of right now
const ItemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    wearable: {
        type: String,
        enum: ['glove', 'bracelet', 'ring']
    },
    //both hands are required because even if one dies i might add a consumable revive item at some point
    isConsumable: {
        type: Boolean,
        required: true
    },
    //visual representation will just be an emoji. i am not a visual artist.
    //every browser supports unicode emojis right?
    visual: {
        type: String,
        required: true,
        match: emojiRegex(), //the package exports a function that returns the emoji regex, so i run and use it here
    },
    effect: {
        //the item's activation function, the code that controls what it does
        //i want to have that in here so it's much easier to store and call upon/run them
        //i don't even know if it makes sense to store functions in a database that sounds really weird and not right...
        type: { any: () => {} }, //does that work? mongoose did say i could make it anything i like... we'll see later
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

ItemSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    description: doc.description,
    wearable: doc.wearable,
    isConsumable: doc.isConsumable,
    visual: doc.visual,
    effect: doc.effect,
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;