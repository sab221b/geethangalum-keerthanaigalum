var express = require('express');
var router = express.Router();
const path = require('path');
const { promisify } = require('util');
const songsDir = path.resolve('assets/source')
const songsIndex = path.resolve('assets/source/sortlist.txt')
const fs = require('fs');

// const readdirP = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

router.get('/', async function (req, res, next) {
  // const dirContents = await readdirP(songsDir);
  fs.readFile(songsIndex, 'utf8', (err, data) => {
    if (err) throw err;
    var songArray = data.split('\n');
    songArray = songArray.map((item) => {
      item = item.replace('\r', '');
      item = item.replace('!@#$', '--- ');
      var songNo = Number(item.split('--- ')[1]) + 1
      var name = item.split('--- ')[0];
      return {
        name,
        songNo,
      };
    })
    res.render('index', { title: 'கீதங்களும் கீர்த்தனைகளும்', songList: songArray });
  });
});

router.get('/:songNo', async function (req, res, next) {

  console.log('req.params', req.params.songNo);
  if (!isNaN(req.params.songNo)) {
    var songSourceNo = (Number(req.params.songNo) - 1).toString();
    const selectedSong = path.resolve('assets/source/' + 'd' + songSourceNo + '.txt');
    fs.readFile(selectedSong, 'utf8', (err, data) => {
      if (err) throw err;
      var songText = data.split('\n');
      res.render('selected-song', { title: 'கீதங்களும் கீர்த்தனைகளும்', songLyrics: songText });
    });
  }
});

module.exports = router;
