'use strict';
const MongoClient = require('mongodb').MongoClient;

const getDbConnections = async () => {
    return new Promise((resolve, reject) => {
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
            if (err) {return reject(err)};
            var dbo = db.db("jukebox");
           return resolve(dbo);
          });
    });
};

// insert Async function..
const insertAsync = async (event, argList, dbConnection) => {
    return new Promise((resolve, reject) => {
        //query to insert data into database
        console.debug('argList', argList);
        try {
            dbConnection.collection(argList.tableName).insertOne(argList.obj, (insertObjectError, insertObjectResult) => {
                if (insertObjectError) {
                    return reject(insertObjectError);
                }
                if (insertObjectResult.insertedCount >= 1) {
                    return resolve(insertObjectResult.ops);
                }
                return resolve(null);
            });
        } catch (e) {
            return resolve("Unable To Insert Data please try again - Exception");
        }
    });
}
// update Async function..
const updateAsync = async (event, argList, dbConnection) => {
    return new Promise((resolve, reject) => {
        let pushObj = argList.pushObj;
        let pullObj = argList.pullObj;
        let updateObj = {
            $set: argList.obj
        }
        if (pullObj) {
            let pullArgList = { $pull: argList.pullObj }
            updateObj = Object.assign(pullArgList, updateObj)
        }
        if (pushObj) {
            let pushArgList = { $push: argList.pushObj }
            updateObj = Object.assign(pushArgList, updateObj)
        }
        //query to update data in the database
        console.debug('argList', argList);
        try {
            dbConnection.collection(argList.tableName).update(argList.query, updateObj, { upsert: true, multi: argList.multi || false },
                (updateObjectError, updateObjectResult) => {
                    if (updateObjectError) {
                        return reject(updateObjectError);
                    }
                    if (updateObjectResult && updateObjectResult.result && updateObjectResult.result.ok === 1) {
                        return resolve(updateObjectResult);
                    }
                    return resolve(null);
                });
        } catch (e) {
            return resolve("Unable To update Data please try again - Exception");
        }
    });
}
// get Async function..
const getAsync = async (event, argList, dbConnection) => {
    return new Promise((resolve, reject) => {
        let projection = argList.projection || {};
        let sort = argList.sort || {};
        let query = argList.query || {};
        let assetcount = parseInt(argList.assetcount) || 100;
        let limit = argList.limit ? argList.limit : assetcount;
        let skipAssets = argList.pageNumber > 0 ? ((argList.pageNumber - 1) * assetcount) : 0;
        //query to get data from database
        console.debug('argList', argList);
        try {
            let collection = dbConnection.collection(argList.tableName);
            collection.find(query, projection).sort(sort).skip(skipAssets).limit(limit).toArray(
                (getResultError, getResult) => {
                    if (getResultError) {
                        return reject(getResultError);
                    }
                    return resolve(getResult);
                });
        } catch (e) {
            return resolve("Unable To Get Data please try again - Exception");
        }
    });
}

module.exports = {
    Insert: async(event, argList, modelCallback) => {
        if (!argList) {
            return modelCallback('Invalid Input - Invalid argList');
        }
        let customError = {};
        customError.file = './models/MongoDB/crud';
        customError.functionName = 'Insert';
        try {
            let dbConnection = await getDbConnections();
            let insertObjectResult = await insertAsync(event, argList, dbConnection);
            return modelCallback(null, insertObjectResult);
        } catch (e) {
            return modelCallback("Unable To Insert Data please try again");
        }
    },
    Update: async(event, argList, modelCallback) => {
        if (!argList) {
            return modelCallback('Invalid Input - Invalid argList');
        }
        let customError = {};
        customError.file = './models/MongoDB/crud';
        customError.functionName = 'Update';
        try {
            let dbConnection = await getDbConnections();
            let updateObjectResult = await updateAsync(event, argList, dbConnection);
            return modelCallback(null, updateObjectResult);
        } catch (e) {
            return modelCallback("Unable To Update Data please try again");
        }
    },
    Get: async (event, argList, modelCallback) => {
        if (!argList) {
            return modelCallback('Invalid Input - Invalid argList');
        }
        let customError = {};
        customError.file = './models/MongoDB/crud';
        customError.functionName = 'Get';
        try {
            let dbConnection = await getDbConnections();
            let getResponse = await getAsync(event, argList, dbConnection);
            return modelCallback(null, getResponse);
        } catch (e) {
            return modelCallback("Unable To Get Data please try again");
        }
    }
};
