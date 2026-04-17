//hand damage
//do i let the client handle the actual rps relationships? rock crushes scissors cuts paper covers rock?
//i think not. we can handle that in here
//we can let the client send us two hands and the throws of each
//so two objects per player, each containing a Hand and a throw (rock paper or scissors)
//post request so we're getting back a body
//each client can send back one request for each of the hands they throw and the hand they target
//meaning each request will have an attacker and a defender, and each turn will have four requests total.
async function damageHand(req, res) {
    const attacker = req.body.attacker; //{hand: Hand, throw: "rock | paper | scissors"}
    const defender = req.body.defender;
    if(!attacker || !defender) {
        return res.status(400).json('Attacker and defender required!'); 
    }

    //rock paper scissors!
    //if you attack into a losing matchup you lose health (broken? unfair? maybe, we'll playtest it out)
    try{
        if(attacker.throw === "rock" && defender.throw === "scissors" ||
            attacker.throw === "paper" && defender.throw === "rock" ||
            attacker.throw === "scissors" && defender.throw === "paper"
        ){
            defender.hand.health--;
            defender.hand.save();
            //i can get each individual Player with a fetch (as would be needed by the game itself already)
            //and send back the Hand object they select with the Hand object they target (both Hands are tracked with the Player)
            //that's entirely doable that sounds entirely doable
            //except maybe the defender bit i'm not too sure of how i would get the other player's Hand just yet
            //shouldn't be too hard tho
        }
        else if (attacker.throw === "rock" && defender.throw === "paper" ||
            attacker.throw === "paper" && defender.throw === "scissors" ||
            attacker.throw === "scissors" && defender.throw === "rock"
        ){
            attacker.hand.health--;
            attacker.hand.save(); //do i even need to do this... i feel like it'd autosave
        }
        else if (attacker.throw === defender.throw) {
            //nothing happens they cancel out
            //but for items i'd want some that proc on ties for sure
            //so imma leave this here
        }
        return res.status(201).json({attacker, defender});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: "Something went wrong when calculating damage."})
    }
}

module.exports = {
    damageHand,
}