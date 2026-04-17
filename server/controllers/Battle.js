const models = require('../models');
const Battle =  models.Battle;

//what to do when a battle resolves
//take a request that has the winner and the loser (sent from the client)
//create a battle object
//.save() it to the database
async function resolve(req, res) {
    const winner = req.body.winner; //Player
    const loser = req.body.loser; //Player

    const battleData = {
        winner, loser
    }

    //when a battle resolves the players become inactive
    winner.active = false;
    loser.active = false;

    try{
        const newBattle = new Battle(battleData);
        await newBattle.save();
        return res.status(201).json({winner: newBattle.winner, loser: newBattle.loser}); //creating a new resource
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: "An error occurred when saving the battle result."});
    }
}

//for the battle log page
//gets all the battles
//supports filtering by your wins and your losses, but idk if i'm putting that in. i still need to make the entire game. help.
async function showBattles(req, res) {
    try {
        const showYourWins = req.query.showYourWins;
        const showYourLosses = req.query.showYourLosses;
        let query = {};
        if(showYourWins) {
            query = {winner: {account: req.session.account._id }} //you can check for your own battles
        }
        if(showYourLosses) {
            query = {loser: {account: req.session.account._id }}
        }
        const docs = await Battle.find(query).lean().exec();
        return res.status(200).json({battles: docs});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({error: "Something went wrong when retrieving all battles"});
    }
}

module.exports = {
    resolve,
    showBattles
}