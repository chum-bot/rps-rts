const models = require('../models');
const Player =  models.Player;
const Hand = models.Hand;

//player creation (do this for each user when they get in-game)
//this object is also used for battle
async function createPlayer(req, res) {
    const account = req.body.account;

    if(!account) {
        return res.status(400).json('Account not sent!'); 
        //this would only run if they somehow got into a game without signing in
        //i have react flow for that so it should not be possible but just in case
    }

    const blankHand = {
        health: 5,
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

module.exports = {
    createPlayer,
}