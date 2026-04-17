const models = require('../models');
const Account = models.Account;

function loginPage(req, res) {
    return res.render('login');
}

function logout(req, res) {
    req.session.destroy();
    return res.redirect('/');
}

function login(req, res) {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if(!username || !pass){
        return res.status(400).json({error: "All fields are required!"});
    }

    return Account.authenticate(username, pass, (err, account) => {
        if(err || !account) {
            return res.status(401).json({error: 'Wrong username or password!'});
        }

        req.session.account = Account.toAPI(account);

        return res.json({redirect: '/maker'});
    })
}

//a PUT request that updates two accounts
//made once a battle ends
function updateBattleInfo(req, res){
    const winner = req.body.winner; //Account
    const loser = req.body.loser; //Account

    //my understanding of the clash royale trophy system, with 25 as a base instead of 30
    //basically what cr does is it adds 1 trophy to your winnings per 10 extra trophies your opponent had on you
    //and it does the opposite if you lose
    //so for example if you had 30 trophies and you beat someone with 40, you would get 25 + 1 so 26 per this system
    //and if you had 40 trophies and lost to someone with 30, you would lose 25 + 1 so 26
    //BRO I HAVEN'T EVEN FIGURED OUT MATCHMAKING YET WHAT AM I DOING.

    winner.trophies += 25 + ((loser.trophies - winner.trophies) / 10) 
    winner.wins++;

    loser.trophies -= 25 - ((winner.trophies - loser.trophies) / 10)
    loser.losses++;

    return res.status(204).json({message: 'WLT updated successfully'});
}

async function signup(req, res) {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if(!username || !pass || !pass2){
        return res.status(400).json({error: "All fields are required!"});
    }

    if(pass !== pass2){
        return res.status(400).json({error: "Passswords do not match!"})
    }

    try{
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username, password: hash, wins: 0, losses: 0, trophies: 0}); //initializing wins/losses/trophies
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({redirect: '/maker'});
    }

    catch (err) {
        console.log(err);
        if(err.code === 11000) {
            return res.status(400).json({error: "Username already in use!"});
        }
        return res.status(500).json({errpr: "An error has occurred!"});
    }
}

module.exports = {
    loginPage, 
    login, 
    logout, 
    signup,
    updateBattleInfo
}