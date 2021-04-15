const express = require("express");
const cors = require("cors");
const { restart } = require("nodemon");
const db = require("./lib/db");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log("My custom middleware");
  console.log(`${method} ${url}`);
  next();
});

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  db.findAll()
    .then((posts) => {
      res.status(200);
      res.json(posts);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Server Error: ${error}`,
      });
    });
});
app.post("/posts", (req, res) => {
  db.insert(req, body)
    .then((newPost) => {
      console.log(newPost);
      res.status(201);
      res.json(newPost);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Error: ${error}`,
      });
    });
});
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then((post) => {
      res.status(200);
      res.json(post);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "Internal Server Error",
      });
    });
});
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.updateById(id, req.body)
    .then((updatedPost) => {
      if (updatedPost) {
        res.status(200);
        res.json(updatedPost);
      } else {
        res.status(400);
        res.json({
          error: `Post with ${id} not found`,
        });
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: `Internal Server error ${error}` });
    });
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.deleteById(id).then((post) => {
    res.status(204);
    res.json(post);
    console.log(`Post with ${id} is deleted`);
  });
});

app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
