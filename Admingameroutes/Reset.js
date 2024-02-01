const router = require('express').Router(),
    { convertleaderboard, convertmonstercoin, convertmonstergem, convertmonstergemunilevel, convertpalosebo, convertsupermonmon, gameplaytimegrindingreset, gametaskreset, gameunlockreset, gamedailytaskreset, gamedailylimitreset , grantenergytoringuser, gamegrindingplayreset , resetgrindingwithmaxenergy} = require('../Admingamecontroller/Reset'),
    { protect } = require('../Middleware/index')

router
    .get('/runtaskleaderboard', protect, convertleaderboard)
    .get('/runtaskmonstercoin', protect, convertmonstercoin)
    .get('/runtaskmonstergem', protect, convertmonstergem)
    .get('/runtaskmonstergemunilevel', protect, convertmonstergemunilevel)
    .get('/runtaskpalosebo', protect, convertpalosebo)
    .get('/runtasksupermonmon', protect, convertsupermonmon)
    .get('/runtaskreset', protect, gametaskreset)
    .get('/runtaskplaytimegrindingreset', protect, gameplaytimegrindingreset)
    .get('/runtaskgameunlockreset', protect, gameunlockreset)
    .get('/runtaskdailytaskreset', protect, gamedailytaskreset)
    .get('/runtaskdailylimitreset', protect, gamedailylimitreset)
    .get('/runtaskgrantenergytoringuser', protect, grantenergytoringuser)
    .get('/runtaskgrindingplayreset', protect, gamegrindingplayreset)
    .get('/runtaskgrindingwithmaxenergyreset', protect, resetgrindingwithmaxenergy)
module.exports = router;