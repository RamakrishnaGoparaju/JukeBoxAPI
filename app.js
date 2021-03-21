const express = require('express');
const app = express();
const requires = require('./requires')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


function defaultResponseHandler(req, res, requestHandler) {
    requestHandler(req, (err, apiRes) => {
        let bodyOut = err ? { statusCode: 401, error: err } :
            { statusCode: 200, result: apiRes };
        res.status(bodyOut.statusCode).send(bodyOut);
    });
}

function promiseResponseHandlerStandard(req, res, requestHandler) {
    return new Promise((resolve, reject) => {
        return resolve(defaultResponseHandler(req, res, requestHandler));
    });
}


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/musicAlbums', (req, res) => promiseResponseHandlerStandard(req, res, requires.musicAlbums.musicAlbums));

app.put('/musicAlbums',jsonParser,(req, res) => promiseResponseHandlerStandard(req, res, requires.musicAlbums.insertMusicAlbum));

app.post('/musicAlbums/:id',jsonParser,(req, res) => promiseResponseHandlerStandard(req, res, requires.musicAlbums.updateMusicAlbum));

app.get('/musicAlbums/:musicianName',jsonParser,(req, res) => promiseResponseHandlerStandard(req, res, requires.musicAlbums.sortByMusician));


app.get('/musicians', (req, res) => promiseResponseHandlerStandard(req, res, requires.musicians.musicians));

app.put('/musicians',jsonParser,(req, res) => promiseResponseHandlerStandard(req, res, requires.musicians.insertMusicians));

app.post('/musicians/:id',jsonParser,(req, res) => promiseResponseHandlerStandard(req, res, requires.musicians.updateMusicians));

app.get('/musicians/:musicAlbum',jsonParser,(req, res) => promiseResponseHandlerStandard(req, res, requires.musicians.sortByMusicAlbum));

const server = app.listen(9001, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
})