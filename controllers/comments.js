const { Comment } = require("../models");

const deleteCommentByCommentId = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(comment => {
      if (!comment) throw { status: 404 };
      res.status(200).send({ msg: "Comment successfully deleted" });
    })
    .catch(next);
};

const upOrDownvoteComment = (req, res, next) => {
  const vote = req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : 0;
  Comment.findByIdAndUpdate(
    { _id: req.params.comment_id },
    {
      $inc: { votes: vote }
    },
    { new: true }
  )
    .then(comment => {
      if (comment === null) throw { status: 404 };
      res.send({ comment });
    })
    .catch(err => {
      if (err.status === 404) next(err);
      else
        next({
          status: 400
        });
    });
};

module.exports = { deleteCommentByCommentId, upOrDownvoteComment };
