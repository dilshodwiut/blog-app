const path = require("path");
const fs = require("fs");
const PORT = 8080;

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// routes
const posts = require("./routes/posts");
const comments = require("./routes/comments");
const getCollection = require("./utils").getCollection;

// serving static files
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// setting template engine
app.set("view engine", "pug");

// posts urls
app.use("/posts", posts);
app.use("/comments", comments);

app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to Blog App!" });
});

app.get("/archive", (req, res) => {
  fs.readFile(getCollection("posts.json"), (err, data) => {
    if (err) res.sendStatus(500);

    const posts = JSON.parse(data).filter((post) => post.archived == true);
    res.render("all_posts", { title: "Archived Posts", posts: posts });
  });
});

app.get("/api/v1/posts", (req, res) => {
  fs.readFile("./database/posts.json", (err, db) => {
    if (err) throw err;

    const posts = JSON.parse(db);
    res.json(posts);
  });
});

// listen for requests :)
const listener = app.listen(PORT, () => {
  console.log(`App is listening on port  http://localhost:${PORT}`);
});
