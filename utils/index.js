const formatArticles = (userDocs, articleData) => {
  return articleData.map(article => {
    return {
      ...article,
      belongs_to: article.topic,
      created_by: userDocs.find(user => {
        if (user.username === article.created_by) return user;
      })._id
    };
  });
};

const formatComments = (userDocs, articleDocs, commentData) => {
  return commentData.map(comment => {
    return {
      ...comment,
      created_by: userDocs.find(user => {
        if (user.username === comment.created_by) return user;
      })._id,
      belongs_to: articleDocs.find(article => {
        if (article.title === comment.belongs_to) return article;
      })._id
    };
  });
};

const formatArticlesWithCommentCount = (articleDocs, commentDocs) => {
  return articleDocs.map(article => {
    const comments = commentDocs.filter(comment => {
      return `${comment.belongs_to}` === `${article._id}`;
    });
    return {
      ...article,
      comment_count: comments.length
    };
  });
};

module.exports = {
  formatArticles,
  formatComments,
  formatArticlesWithCommentCount
};
