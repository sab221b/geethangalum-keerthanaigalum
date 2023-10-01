var path = require('path');
const songsIndex = path.resolve('assets/source/sortlist.txt')
const fs = require('fs');
const { createWorker } = require('tesseract.js');


exports.listSongs = (req, res) => {
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
        });
        if (!Object.keys(req.query).length || req.query.sortBy === 'songNo') {
            songArray = songArray.sort((a, b) => {
                return a.songNo - b.songNo;
            })
        }
        res.render('index', { title: 'கீதங்களும் கீர்த்தனைகளும்', songList: songArray });
    });
}

exports.getSongbyNumber = (req, res) => {
    console.log('req.params', req.params.songNo);
    if (!isNaN(req.params.songNo)) {
        var songSourceNo = (Number(req.params.songNo)).toString();
        const selectedSong = path.resolve('assets/new-source/' + songSourceNo + '.txt');
        fs.readFile(selectedSong, 'utf8', (err, data) => {
            if (err) throw err;
            var songText = data.split('\n');
            res.render('selected-song', { title: 'கீதங்களும் கீர்த்தனைகளும்', songLyrics: songText });
        });
    }
}

exports.ImagetoTextOCR = async (req, res) => {
    const worker = await createWorker('tam');
    const folderPath = 'assets/image-canvases';
    fs.readdir(folderPath, async (error, files) => {
        if (error) {
            console.log(error);
        } else {
            for (let i = 0; i < files.length; i++) {
                if (i === files.length) {
                    await worker.terminate();
                    break;
                }
                const fileName = files[i]
                const canvasImg = path.resolve(`assets/image-canvases/${fileName}`)
                const { data: { text } } = await worker.recognize(canvasImg);
                fs.writeFileSync(`assets/new-source/${fileName.replace(".png", ".txt")}`, text);
            }
        }
    });
}