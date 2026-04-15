const models = require('../models');
const Battle =  models.Battle;

//what to do when a battle resolves?
//take a request that has the winner and the loser (sent from the client)
//create a battle object
//.save() it to the database
async function resolve(req, res) {
    const winner = req.body.winner; //Player
    const loser = req.body.loser; //Player

    const battleData = {
        winner, loser
    }

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

module.exports = {
    resolve,
}