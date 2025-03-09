const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send(`Express on Vercel: ${req.query.fileName}`);
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
