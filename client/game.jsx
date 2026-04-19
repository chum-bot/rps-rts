//GAME.JSX
//this shall hold all of our actual game components and functionality
//I SHOULD REALLY GET AT LEAST THIS WORKING FOR THE MILESTONE

//so what do we need
//a Player for each Account (handled in the handlePlayer function i already made in room.jsx)
//we need the visual display of what players are doing, which has: 
//- two hands, filled with information that is contained within Player (each of them has a Hand)
//i would want to make a hand component probably, just to make things a bit easier?
//we need the functionality of clicking a hand, selecting a throw, and selecting an opposing hand to target
//but in order to do that we need the hands themselves

//to begin a game, i need each user to create a Player for themselves, using the account they're signed into
//meaning i need a current account looker, i can GET to account for that
async function getAccount(){
    const response = await fetch('/account');
    const data = await response.json();
    if(!data) {
        helper.handleError('Error retrieving account');
        return false;
    }
    return data;
}

async function handlePlayer(e){
    const account = getAccount();
    //i then call a POST to createPlayer, they send that back and i work with that for the games themselves
    helper.sendPost(e.target.action, {account: account._id});
    //now the player exists, with their blank hand and stuff
    //so later i can GET that player for use with the game
    return false;
}