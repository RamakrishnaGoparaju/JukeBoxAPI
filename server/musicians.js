
'use strict';

const ObjectID = require('mongodb').ObjectID;
let crud = require('./crud')


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
    sortByMusicAlbum: async (event, modelCallback) => {
        //validation of input variables. 
        let eventParams = event.params || {};
        let musicAlbumName = eventParams.musicAlbum;
        if (!musicAlbumName) {
            return modelCallback("Mising musicAlbumName.")
        }
        let query = { 'albumName': musicAlbumName }
        let args = {
            query: query,
            sort: { 'musicianName': 1 },
            tableName: "musicAlbums"
        }
        let resOut = await DBFun(event, args, 'Get');
        return modelCallback(null, resOut);
    },
    insertMusicians: async (event, modelCallback) => {
        let eventBody = event.body;
        if (eventBody && Object.keys(eventBody).length == 0) {
            return modelCallback("Invalid Input - Missing Body in the Request.")
        }
        let musicianName = eventBody.musicianName;
        //validation of input variables.
        if (!musicianName) {
            return modelCallback("Missing musicianName - Please enter musicianName.")
        }
        if (musicianName.length <= 3) {
            return modelCallback("musicianName should be graterthan 3 characters.")
        }
        let args = {
            obj: eventBody,
            tableName: "musicians"
        }
        let dataOut = await DBFun(event, args, 'Insert');
        return modelCallback(null, dataOut);
    },
    updateMusicians: async (event, modelCallback) => {
        let eventParams = event.params || {};
        let eventBody = event.body;
        let albumId = eventParams.id;
        console.debug('eventParams', eventParams)
        if (eventBody && Object.keys(eventBody).length == 0) {
            return modelCallback("Invalid Input - Missing Body in the Request.")
        }
        let musicianName = eventBody.musicianName;
        //validation of input variables.
        if (musicianName.length <= 3) {
            return modelCallback("musicianName should be graterthan 3 characters.")
        }
        let query = {
            "_id": new ObjectID(albumId)
        }
        let args = {
            query: query,
            obj: eventBody,
            tableName: "musicians"
        }
        try {
            await DBFun(event, args, 'Update');
            return modelCallback(null, "Musician Updated..");
        } catch (e) {
            return modelCallback("Unable to Update Musicians..");
        }
    }
}