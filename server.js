var express = require('express');
var app = express();

const bodyParser = require('body-parser');

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
var songInfos = require('./models/songInfos.js');
var comments = require('./models/comments.js');
var saves = require('./models/saves.js');

var db;
var currSongs;
var songNames;
var songs = [ { title: 'IDGAF', artist: 'Drake, Yeat', imageURL: "images/idgaf.jpeg", moreinfo: 'IDGAF is a song by Canadian rapper and singer Drake featuring American rapper Yeat. It was released through OVO and Republic as the seventh track from Drakes eighth studio album, For All the Dogs, on October 6, 2023.'},
                            { title: 'SAY MY GRACE (feat. Travis Scott)', artist: 'Offset, Travis Scott', imageURL: "images/set-if-off.jpg", moreinfo: 'Say My Grace is a song by American rapper Offset, featuring vocals from fellow American rapper and singer Travis Scott. It was released through Motown as the fourth single from Offsets second studio album, Set It Off, on October 13, 2023, along with the album.' },
                            { title: 'MELTDOWN (feat. Drake)', artist: 'Travis Scott, Drake', imageURL: '/images/Travis_Scott_-_Utopia.png', moreinfo: 'Meltdown is a song by American rapper and singer Travis Scott featuring Canadian rapper Drake. It was released on July 28, 2023, as the seventh track and third single from the formers fourth studio album Utopia.' },
                            { title: 'To The Bank', artist: 'Lil Wayne, Cool & Dre', imageURL: '/images/to-the-bank.jpg', moreinfo: 'To The Bank is a high-energy anthem that seamlessly blends Lil Waynes signature rapid-fire flow with Cool & Dres production wizardry. The result is a track that is impossible not to groove to, making it a must-listen for fans of hip-hop and rap.' },
                            { title: 'Rap Saved Me (feat. Quavo)', artist: '21 Savage, Offset, Metro Boomin, Quavo', imageURL: '/images/rap-saved-me.png', moreinfo: 'Rap Saved Me is a song by Atlanta-based rapper 21 Savage, American rapper Offset, and American record producer Metro Boomin from their collaborative studio album Without Warning (2017). It features American rapper Quavo.' },
                            { title: 'Superhero (Heroes & Villains) [with Future & Chris Brown]', artist: 'Metro Boomin, Future, Chris Brown', imageURL: '/images/superheroes.png', moreinfo: 'Superhero (Heroes & Villains) is a song by American record producer Metro Boomin, American rapper Future, and American singer Chris Brown, released as the title track from the formers second studio album Heroes & Villains (2022). Co-produced by Allen Ritter and David X Eli, it peaked at number 8 on the Billboard Hot 100.' },
                            { title: 'Rap God', artist: 'Eminem', imageURL: '/images/Eminem_Rap_God.png', moreinfo: 'Rap God is a song by American rapper Eminem. The song premiered via YouTube on October 14, 2013, and was released in the United States on October 15, 2013, as the third single from Eminems eighth studio album, The Marshall Mathers LP 2 (2013). It contains references to previous conflicts in Eminems career, as well as to other rappers conduct.'},
                            { title: 'amari', artist: 'J. Cole', imageURL: '/images/TheOff-Season.jpeg', moreinfo: 'Amari (stylized as a m a r i) is a song by American rapper J. Cole. It was released on May 14, 2021 on Coles sixth studio album, The Off-Season.[2]'},
                            { title: 'Father Stretch My Hands Pt. 1', artist: 'Kanye West', imageURL: '/images/The_life_of_pablo_alternate.jpg', moreinfo: 'Father Stretch My Hands are songs by American rapper Kanye West from his seventh studio album, The Life of Pablo (2016). They are split into two parts on the album: Father Stretch My Hands, Pt. 1 and Pt. 2. Pt. 1 contains vocals by American rapper Kid Cudi and American R&B singer Kelly Price, while Pt. 2 includes vocals from American rapper Desiigner and American musician Caroline Shaw.'},
                            { title: 'Sky', artist: 'Playboi Carti', imageURL: '/images/whole.jpeg', moreinfo: 'Sky is a song by American rapper Playboi Carti. It was released as the nineteenth track from Cartis second studio album, Whole Lotta Red, on December 25, 2020. The track peaked at number four on the Bubbling Under Hot 100 chart.'},
                          ];

const uri = "mongodb+srv://blimaye:1fNhbEi1dERRufQP@cluster0.x5vrqdd.mongodb.net/song?retryWrites=true&w=majority";

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.listen(8080);


const start = async() => {
    try {
        await mongoose.connect(uri);
        db = mongoose.connection;

        console.log('App listening on port 8080');

        var currSongs = await songInfos.find({});
        songNames = ['IDGAF', 'SAY MY GRACE', 'MELTDOWN (feat. Drake)', 'To The Bank', 'Rap Saved Me (feat. Quavo)', 'Superhero (Heroes & Villains) [with Future & Chris Brown]', 'Rap God', 'amari', 'Father Stretch My Hands Pt. 1', 'Sky'];

        if(currSongs.length == 0) {

            for(let i = 0; i < songs.length; i++) {
                var song = new songInfos({title: songs[i].title, artist: songs[i].artist, imageURL: songs[i].imageURL, moreinfo: songs[i].moreinfo});
                song.save();
            }
        }
    }
    catch(e) {
        console.log(e.message);
    }
};

start();

// use res.render to load up an ejs view file

app.get('/', function (req, res) {
    res.send('Welcome to the home page!');
});

// listener page
app.get('/listener', async function (req, res) {

    var postedComments = await comments.find({});
    var songList = await songInfos.find({});
    var savedList = await saves.find({});
    var username = "Jimmy";
    res.render('pages/listener', {
        username: username,
        songList: songList,
        comments: comments,
        savedList: savedList
    });
});

app.get('/api/getSongList', async (req, res) => {
    try {
        const songList = await songInfos.find({});
        res.json({ success: true, songList });
    } catch (error) {
        console.error('Error fetching song list:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/api/getSavedSongs', async (req, res) => {
    try {
        const savedSongs = await saves.find({});
        res.json({ success: true, savedSongs });
    } catch (error) {
        console.error('Error fetching song list:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



app.post('/insertComment', async (req, res) => {
    try {
        const { message } = req.body;
        const newComment = new comments({ message: message });
        await newComment.save();
        res.json({ success: true, message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/saveSong', async (req, res) => {
    try {
        const { title, artist, imageURL } = req.body;

        const ssong = await songInfos.findOne({ title: title });
                    
        if (ssong) {
            const savedSong = new saves({
                title: ssong.title,
                artist: ssong.artist,
                imageURL: ssong.imageURL
            });

            await savedSong.save();

            res.json({ success: true, message: 'Song saved successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Song not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/addCustomSong', async (req, res) => {
    try {
        const { title, artist, imageURL, moreinfo } = req.body;

        const customSong = new songInfos({ title: title, artist: artist, imageURL: imageURL, moreinfo: moreinfo });
        await customSong.save();

        res.json({ success: true, message: 'Custom song added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/removeSavedSong', async (req, res) => {
    try {
        const { title, artist, imageURL } = req.body;

        const savesCollection = mongoose.connection.collections['saves'];

        if(savesCollection) {
            await savesCollection.deleteOne({title: title});
        }

        res.json({ success: true, message: 'Song removed successfully' });
    } catch (error) {
        console.error('Error removing song:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/removeUpNextSong', async (req, res) => {
    try {
        const { title, artist, imageURL, moreinfo } = req.body;

        const songInfosCollection = mongoose.connection.collections['songinfos'];

        if(songInfosCollection) {
            await songInfosCollection.deleteOne({title: title});
        }
        
        res.json({ success: true, message: 'Song removed successfully' });
    } catch (error) {
        console.error('Error removing song:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/resetData', async (req, res) => {

    const savesCollection = mongoose.connection.collections['saves'];

    if(savesCollection) {
        await savesCollection.deleteMany({});
    }


    const songInfosCollection = mongoose.connection.collections['songinfos'];

    if (songInfosCollection) {
        await songInfosCollection.deleteMany();

        for(let i = 0; i < songs.length; i++) {
            var song = new songInfos({title: songs[i].title, artist: songs[i].artist, imageURL: songs[i].imageURL, moreinfo: songs[i].moreinfo});
            song.save();
        }
    }


    res.json({ success: true });
});


// producer page
app.get('/producer', function (req, res) {
    var username = "Producer User";
    res.render('pages/producer', {
        username: username
    });
});

// DJ page
app.get('/dj', function (req, res) {
    var username = "DJ User";
    res.render('pages/dj', {
        username: username
    });
});
