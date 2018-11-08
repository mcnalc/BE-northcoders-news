const { User } = require("../models");

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  User.findOne({ username })
    .then(user => {
      if (!user)
        throw {
          status: 404,
          msg: `${username} not found`
        };
      res.send(user);
    })
    .catch(next);
};

module.exports = { getUserByUsername };
