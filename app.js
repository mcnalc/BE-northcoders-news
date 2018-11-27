const app = require("express")();
const cors = require("cors");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { handle400s, handle404s, handle500s } = require("./error");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("./config");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch();

app.use(cors());

app.get("/api", (req, res, next) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.use(bodyParser.json());
app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404 });
});

app.use(handle400s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
