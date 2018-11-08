process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../seed/testData");
const seedDB = require("../seed/seed");

describe("/api", () => {
  const wrongId = mongoose.Types.ObjectId();
  beforeEach(() =>
    seedDB(topicData, userData, articleData, commentData).then(docs => {
      [topicDoc, userDoc, articleDoc, commentDoc] = docs;
    }));
  after(() => mongoose.disconnect());

  describe("/topics", () => {
    it("GET responds with status code 200 and an array of topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics).to.have.length(2);
          expect(topics[0]).to.have.keys("_id", "title", "slug", "__v");
        });
    });
    it("GET responds with status code 404 when endpoint doesn't exist", () => {
      return request
        .get("/api/topisc")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Page Not Found");
        });
    });
    describe("/:slug", () => {
      it("GET responds with status code 200 and an array of articles by requested topic", () => {
        return request
          .get("/api/topics/cats/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles).to.have.length(2);
            expect(articles[0]).to.have.keys(
              "votes",
              "title",
              "created_by",
              "created_at",
              "body",
              "belongs_to",
              "_id",
              "__v",
              "comment_count"
            );

            expect(articles[0].comment_count).to.equal(2);
          });
      });
      describe("/articles", () => {
        it("POST responds with status code 201 and the article which has been added to a certain topic", () => {
          const newArticle = {
            title: "This article is new",
            created_by: "5bacb626c997a64582c568e7",
            body: "This is a new article"
          };
          return request
            .post("/api/topics/cats/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body: { article } }) => {
              expect(article.belongs_to).to.equal("cats");
              expect(article.comment_count).to.equal(0);
            });
        });
        it("POST responds with status code 400 if the posted article object does not conform to schema requirements", () => {
          const missingKeysArticle = {
            title: "This article is new",
            body: "This is a new article"
          };
          return request
            .post("/api/topics/cats/articles")
            .send(missingKeysArticle)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
      });
    });
  });
  describe("/articles", () => {
    it("GET responds with status code 200 and an array of articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("array");
          expect(articles).to.have.length(4);
          expect(articles[0].comment_count).to.equal(2);
        });
    });
    it("GET responds with status code 404 when endpoint doesn't exist", () => {
      return request
        .get("/api/aticles")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Page Not Found");
        });
    });
    describe("/articles/:articleId", () => {
      it("GET returns 200 and the requested individual article", () => {
        return request
          .get(`/api/articles/${articleDoc[0]._id}`)
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.article.title).to.equal(articleDoc[0].title);
            expect(res.body.article.title).to.not.equal("This random title");
            expect(res.body.article._id).to.equal(`${articleDoc[0]._id}`);
          });
      });
      it("GET responds with status code 400 for an invalid article id", () => {
        return request
          .get(`/api/articles/dogsarebetterthancats`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad Request");
          });
      });
      it("GET responds with status code 404 when article ID is not found", () => {
        return request
          .get(`/api/articles/${wrongId}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page Not Found");
          });
      });
      it("PATCH returns status 200 and an article with a vote count increased by one when the request query is set to 'up'", () => {
        return request
          .patch(`/api/articles/${articleDoc[0]._id}?vote=up`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(articleDoc[0].votes + 1);
          });
      });
      it("PATCH returns status 200 and an article with a vote count decreased by one when the request query is set to 'down'", () => {
        return request
          .patch(`/api/articles/${articleDoc[0]._id}?vote=down`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(articleDoc[0].votes - 1);
          });
      });
      it("PATCH returns status 200 and an article with the same vote count when the request query is empty", () => {
        return request
          .patch(`/api/articles/${articleDoc[0]._id}?vote=`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(articleDoc[0].votes);
          });
      });

      it("PATCH returns status 400 and an article with the same vote count when the article ID is invalid", () => {
        return request
          .patch(`/api/articles/thisisinvalidinput?votes=up`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad Request");
          });
      });
      it("PATCH returns status 404 and 'Page Not Found' when article ID does not exist", () => {
        return request
          .patch(`/api/articles/${wrongId}?votes=up`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page Not Found");
          });
      });
      describe("/comments", () => {
        it("GET returns status 200 and an array of comments for an individual article", () => {
          return request
            .get(`/api/articles/${articleDoc[0]._id}/comments`)
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.have.lengthOf(2);
              expect(res.body.comments).to.be.an("array");
            });
        });
        it("GET returns a 400 for an article id that is invalid", () => {
          return request
            .get(`/api/articles/elephant/comments`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });

        it("GET returns a 404 for an article id that does not exist", () => {
          return request
            .get(`/api/articles/${wrongId}/comments`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Page Not Found");
            });
        });

        it("POST returns status 201 and the comment added to the article", () => {
          const newComment = {
            created_by: `${articleDoc[0]._id}`,
            body: "New comment"
          };
          return request
            .post(`/api/articles/${articleDoc[0]._id}/comments`)
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment.belongs_to).to.equal(`${articleDoc[0]._id}`);
              expect(comment.body).to.be.a("string");
            });
        });
        it("POST returns status 400 for a comment which doesn't conform to schema", () => {
          const missingKeysComment = {
            body: "New comment"
          };
          return request
            .post(`/api/articles/${articleDoc[0]._id}/comments`)
            .send(missingKeysComment)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("Bad Request");
            });
        });
        it("POST returns a 400 for an invalid article id", () => {
          const newComment = {
            created_by: `${articleDoc[0]._id}`,
            body: "New comment"
          };
          return request
            .post(`/api/articles/elephant/comments`)
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        // it("POST returns a 404 for an article id that does not exist", () => {
        //   const newComment = {
        //     created_by: `${articleDoc[0]._id}`,
        //     body: "New comment"
        //   };
        //   return request
        //     .post(`/api/articles/${mongoose.Types.ObjectId()}/comments`)
        //     .send(newComment)
        //     .expect(404)
        //     .then(({ body: { msg } }) => {
        //       expect(msg).to.equal("Page Not Found");
        //     });
        // });
        describe("/:comment_id", () => {
          it("PATCH returns status 200 and a comment with a vote count increased by one when the request query is set to 'up'", () => {
            return request
              .patch(`/api/comments/${commentDoc[0]._id}?vote=up`)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(commentDoc[0].votes + 1);
              });
          });
          it("PATCH returns status 200 and a comment with a vote count decreased by one when the request query is set to 'down'", () => {
            return request
              .patch(`/api/comments/${commentDoc[0]._id}?vote=down`)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(commentDoc[0].votes - 1);
              });
          });
          it("PATCH returns status 200 and a comment with the same vote count when the request query is empty", () => {
            return request
              .patch(`/api/comments/${commentDoc[0]._id}?vote=`)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(commentDoc[0].votes);
              });
          });
          it("PATCH returns status 400 and a comment with the same vote count when the article ID is invalid", () => {
            return request
              .patch(`/api/comments/elephant?votes=up`)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("PATCH returns status 404 and 'Page Not Found' when comment ID does not exist", () => {
            return request
              .patch(`/api/comments/${wrongId}?votes=up`)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Page Not Found");
              });
          });
          it("DELETE removes requested comment and returns 200 status code", () => {
            return request
              .delete(`/api/comments/${commentDoc[0]._id}`)
              .expect(200)
              .then(res => {
                expect(res.body.msg).to.equal("Comment successfully deleted");
              });
          });
          it("DELETE returns status code 400 for an invalid comment id", () => {
            return request
              .delete(`/api/comments/abcde23242424`)
              .expect(400)
              .then(res => {
                expect(res.body.msg).to.equal("Bad Request");
              });
          });
          it("DELETE returns status code 404 for a non existing comment id", () => {
            return request
              .delete(`/api/comments/${wrongId}`)
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal("Page Not Found");
              });
          });
          describe("/:username", () => {
            it("GET returns 200 and the user's profile", () => {
              return request
                .get(`/api/users/${userDoc[0].username}`)
                .expect(200)
                .then(res => {
                  expect(res.body.username).to.equal(`${userDoc[0].username}`);
                  expect(res.body).to.be.an("object");
                });
            });

            it("GET responds with status 404 when given a non-existing username", () => {
              return request
                .get("/api/users/crazycat")
                .expect(404)
                .then(res => {
                  expect(res.body.msg).to.equal(`crazycat not found`);
                });
            });
          });
        });
      });
    });
  });
});
