exports.handle400s = (err, req, res, next) => {
  if (
    err.status == 400 ||
    err.name === "CastError" ||
    err.name === "ValidationError"
  )
    res.status(400).send({ msg: err.msg || "Bad Request" });
  else next(err);
};

exports.handle404s = (err, req, res, next) => {
  if (err.status == 404)
    res.status(404).send({ msg: err.msg || "Page Not Found" });
  else next(err);
};
exports.handle500s = (err, req, res, next) => {
  if (err.status === 500)
    res.status(500).send({ msg: err.msg || "Internal Error" });
};
