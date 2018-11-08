const topicRouter = require("express").Router();
const {
  getTopics,
  getArticlesByTopic,
  addArticleToTopic
} = require("../controllers/topics");

topicRouter.get("/", getTopics);

topicRouter
  .route("/:slug/articles")
  .get(getArticlesByTopic)
  .post(addArticleToTopic);

module.exports = topicRouter;
