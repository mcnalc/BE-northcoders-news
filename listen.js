const PORT = process.env.PORT || 9090;
const app = require("./app");

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}...`);
});
