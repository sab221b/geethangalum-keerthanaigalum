var express = require('express');
var router = express.Router();
const songsCtrl = require("../controllers/songs");

router.get('/', songsCtrl.listSongs);
router.get('/:songNo', songsCtrl.getSongbyNumber);

module.exports = router;
        