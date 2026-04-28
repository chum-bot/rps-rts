async function roomPage(req, res){
    return res.render('room');
}

async function gamePage(req, res){
    return res.render('game')
}

module.exports = {
    roomPage,
    gamePage
}