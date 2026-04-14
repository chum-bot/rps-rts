const mongoose = require('mongoose');
const emojiRegex = require('emoji-regex'); //emoji-regex npm library: https://www.npmjs.com/package/emoji-regex

//schema for the item entity
//now THIS is where the scope REALLY creeps...
//they have an isConsumable tag for consumable and permanent items SCOPE CREEP...
//i might also give some items a duration SCOPE CREEP......
//they have a function as their effect i would imagine (baseline for a functioning item but EVEN THIS COULD BE SCOPE CREEP.........)
//they have a wearable that says what they are (glove bracelet ring, ez it's just an enum)

//this feels silly though
//
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
        //but... how?
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