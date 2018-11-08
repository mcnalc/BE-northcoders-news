const mongoose = require("mongoose");
const { Topic, User, Article, Comment } = require("../models");
const { formatArticles, formatComments } = require("../utils");

const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      return Promise.all([
        topicDocs,
        userDocs,
        Article.insertMany(formatArticles(userDocs, articleData, topicDocs))
      ]);
    })
    .then(([topicDocs, userDocs, articleDocs]) => {
      return Promise.all([
        topicDocs,
        userDocs,
        articleDocs,
        Comment.insertMany(formatComments(userDocs, articleDocs, commentData))
      ]);
    });
};

module.exports = seedDB;
