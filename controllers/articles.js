const { Article, Comment } = require("../models");
const { formatArticlesWithCommentCount } = require("../utils");

const getAllArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .lean()
    .then(articleDocs => {
      return Promise.all([articleDocs, Comment.find()]);
    })
    .then(([articleDocs, commentDocs]) => {
      const articles = formatArticlesWithCommentCount(articleDocs, commentDocs);
      res.send({ articles });
    })
    .catch(next);
};

const getArticlesById = (req, res, next) => {
  Article.findById(req.params.article_id)
    .populate("created_by")
    .then(article => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Page Not Found" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  Article.findById(req.params.article_id)
    .then(article => {
      article;
    })
    .then(() =>
      Comment.find({ belongs_to: req.params.article_id })
        .populate("created_by")
        .populate("belongs_to")
    )
    .then(comments => {
      if (comments.length === 0) throw { status: 404 };
      res.send({ comments });
    })
    .catch(next);
};

const addCommentToArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  Comment.create({ ...req.body, belongs_to: article_id })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const upOrDownvoteArticle = (req, res, next) => {
  const vote = req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : 0;
  Article.findByIdAndUpdate(
    { _id: req.params.article_id },
    {
      $inc: { votes: vote }
    },
    { new: true }
  )
    .then(article => {
      if (article === null) throw { status: 404 };
      res.send({ article });
    })
    .catch(err => {
      if (err.status === 404) next(err);
      else
        next({
          status: 400
        });
    });
};

module.exports = {
  getAllArticles,
  getArticlesById,
  getCommentsByArticleId,
  addCommentToArticle,
  upOrDownvoteArticle
};