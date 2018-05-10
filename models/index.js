const { MongoClient } = require("mongodb");
const config = require("../config");

let db = null;

MongoClient.connect(
  config.mongodb,
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Connected successfully to server");
    db = client.db(config.databaseName);
  }
);

module.exports = {
  get database() {
    return db;
  }
};
