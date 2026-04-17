const models = require('../models');
const Player =  models.Player;
const Hand = models.Hand;

//player creation (do this for each user when they get in-game)
//used for battle and storing battles in the log
async function createPlayer(req, res) {
    const account = req.body.account;

    if(!account) {
        return res.status(400).json('Account not sent!'); 
        //this would only run if they somehow got into a game without signing in
        //i have react flow for that so it should not be possible but just in case
    }

    const blankHand = {
        health: 5,
        isDead: false, //just a flag the client can use for displaying death
    }
    const left = new Hand(blankHand);
    const right = new Hand(blankHand);

    const playerData = { account, left, right }

    try{
        const newPlayer = new Player(playerData);
        await newPlayer.save();
        return res.status(201).json(newPlayer); //creating a new resource
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: "An error occurred when creating the player object."});
    }
}

//gets the created player object for use in battle
//we'll make a hand controller for use with managing player hands
//so you know, the whole core of the game which still doesn't exist yet!
//client will determine winner and loser and send it as a fetch to the battle controller
async function getPlayer(req, res) {
    try{
        const query = {account: req.session.account._id, active: true}; 
        const docs = await Player.find(query).lean().exec();
        return res.status(200).json({player: docs});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: "An error occurred when retrieving the player object."})
    }
}

module.exports = {
    createPlayer,
    getPlayer
}