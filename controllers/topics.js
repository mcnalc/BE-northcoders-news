const { Topic, Article, Comment } = require("../models");
const { formatArticlesWithCommentCount } = require("../utils");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.slug })
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

const addArticleToTopic = (req, res, next) => {
  req.body.belongs_to = req.params.slug;

  Topic.find({ slug: req.params.slug }).then(topicDoc => {
    Article.create({ ...req.body, belongs_to: req.params.slug })
      .then(articleDoc => {
        const article = {
          ...articleDoc._doc,
          comment_count: 0
        };
        res.status(201).send({ article });
      })
      .catch(next);
  });
};

module.exports = { getTopics, getArticlesByTopic, addArticleToTopic };
