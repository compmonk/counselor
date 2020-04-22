const MongoClient = require("mongodb").MongoClient;
const mongoConfig = require("../settings").mongoConfig1;
const mongoose = require("mongoose");

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};

const getCollection = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }
    return _col;
  };
};

module.exports = {
  users: getCollection("users"),
  articles: getCollection("articles"),
  sessions: getCollection("sessions"),
};
