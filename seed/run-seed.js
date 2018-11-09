const mongoose = require("mongoose");
const { DB_URL } = require("../config");
const { topicData, articleData, commentData, userData } = require("./devData");
const seedDB = require("./seed");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    return seedDB(topicData, userData, articleData, commentData);
  })
  .then(() => {
    console.log("Disconnecting from database!");
    return mongoose.disconnect();
  });
