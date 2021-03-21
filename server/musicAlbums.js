
'use strict';

const ObjectID = require('mongodb').ObjectID;
let crud = require('./crud')
const _ = require('lodash')


const DBFun = async (event, argListElement, crudOp) => {
    return new Promise((resolve, reject) => {
        crud[crudOp](event, argListElement, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}


module.exports = {
    musicAlbums: async (event, modelCallback) => {
        //validation of input variables. 
        let query = {}
        let args = {
            query: query,
            tableName: "musicAlbums"
        }
        let resOut = await DBFun(event, args, 'Get');
        if(resOut && resOut.length == 0){
            return modelCallback(null, resOut);
        }
        resOut = _.sortBy(resOut, 'dateOfRelease')
        return modelCallback(null, resOut);
    },
    sortByMusician: async (event, modelCallback) => {
        //validation of input variables. 
        let eventParams = event.params || {};
        let musicianName = eventParams.musicianName || "";
        let query = {musicianName: musicianName}
        let args = {
            query: query,
            sort : {'price':1},
            tableName: "musicAlbums"
        }
        let resOut = await DBFun(event, args, 'Get');
        if(resOut && resOut.length == 0){
            return modelCallback(null, resOut);
        }
        return modelCallback(null, resOut);
    },
    insertMusicAlbum: async (event, modelCallback) => {
        let eventBody = event.body;
        if (eventBody && Object.keys(eventBody).length == 0) {
            return modelCallback("Invalid Input - Missing Body in the Request.")
        }
        let albumName = eventBody.albumName;
        let dateOfRelease = eventBody.dateOfRelease;
        let genre = eventBody.genre || "";
        let price = eventBody.price;
        let description = eventBody.description || "";
        let musicianName = eventBody.musicianName || "";
        //validation of input variables.
        if (!albumName) {
            return modelCallback("Missing albumName - Please enter albumname.")
        }
        if (!dateOfRelease) {
            return modelCallback("Missing dateOfRelease - Please enter dateOfRelease.")
        }
        if (!price) {
            return modelCallback("Missing price - Please enter price.")
        }
        if (albumName.length <= 5) {
            return modelCallback("albumname should be graterthan 5 characters.")
        }
        if (typeof (price) != 'number') {
            return modelCallback("price should integer.")
        }
        if (price < 100) {
            return modelCallback("price should not be lessthan 100")
        }
        if (price >= 1000) {
            return modelCallback("price should not graterthan be  1000")
        }
        eventBody["description"] = description
        eventBody["genre"] = genre
        eventBody["musicianName"] = musicianName
        let args = {
            obj: eventBody,
            tableName: "musicAlbums"
        }
        let summaryOut = await DBFun(event, args, 'Insert');
        return modelCallback(null, summaryOut);
    },
    updateMusicAlbum: async (event, modelCallback) => {
        let eventParams = event.params || {};
        let eventBody = event.body;
        let albumId = eventParams.id;
        console.debug('eventParams', eventParams)
        //validation of input variables.
        if(!albumId){
            return modelCallback("Missing albumId.")
        }
        let albumName = eventBody.albumName;
        let price = eventBody.price;
        if (albumName && albumName.length <= 5) {
            return modelCallback("albumname should be graterthan 5 characters.")
        }
        if (price && typeof (price) != 'number') {
            return modelCallback("price should integer.")
        }
        if (price && price < 100) {
            return modelCallback("price should not be lessthan 100")
        }
        if (price && price >= 1000) {
            return modelCallback("price should not graterthan be  1000")
        }
        let query = {
            "_id": new ObjectID(albumId)
        }
        let args = {
            query: query,
            obj: eventBody,
            tableName: "musicAlbums"
        }
        let summaryOut = await DBFun(event, args, 'Update');
        return modelCallback(null, summaryOut);
    }
}