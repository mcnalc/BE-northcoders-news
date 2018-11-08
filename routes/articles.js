const articleRouter = require("express").Router();
const {
  getAllArticles,
  getArticlesById,
  getCommentsByArticleId,
  addCommentToArticle,
  upOrDownvoteArticle
} = require("../controllers/articles");

articleRouter.route("/").get(getAllArticles);

articleRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(upOrDownvoteArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(addCommentToArticle);

module.exports = articleRouter;
