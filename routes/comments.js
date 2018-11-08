const commentRouter = require("express").Router();
const {
  deleteCommentByCommentId,
  upOrDownvoteComment
} = require("../controllers/comments");

commentRouter
  .route("/:comment_id")
  .patch(upOrDownvoteComment)
  .delete(deleteCommentByCommentId);

module.exports = commentRouter;
