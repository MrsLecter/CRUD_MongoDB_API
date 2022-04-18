const { MongoClient } = require("mongodb");
connection_str =
  "mongodb+srv://**login**:**passwd**@cluster0.2vrmo.mongodb.net/**database**?retryWrites=true&w=majority";
const client = new MongoClient(connection_str, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let dbConnection = null;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("persons_storage");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
