// set up ======================================================================
const http = require("http");
const express = require("express");
const app = express(); // create our app w/ express
const mongoose = require("mongoose"); // mongoose for mongodb
const cors = require("cors");

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");

const port = 4000;

let isDone = false;

// configuration ===============================================================
mongoose.connect("mongodb+srv://mong_user:ZyknVjSD08lzoirx@sandbox.ch0tqfo.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
}); // connect to mongoDB database on modulus.iox 

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // set the static files location /public/img will be /img for users

// define model ================================================================
let Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean,
  // editing: Boolean
});

// routes ======================================================================
app.use(cors());

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// api ---------------------------------------------------------------------
// get all todos
app.get("/api/todos", function (req, res) {
  // use mongoose to get all todos in the database
  Todo.find(function (err, todos) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(todos); // return all todos in JSON format
  });
});

app.get("/api/todos/:todo_id", function (req, res) {
  // use mongoose to get all todos in the database
  Todo.find(
    {
      _id: req.params.todo_id,
    },
    function (err, todos) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);

      res.json(todos); // return all todos in JSON format
    }
  );
});

// create todo and send back all todos after creation
app.post("/api/todos", function (req, res) {
  // create a todo, information comes from AJAX request from Angular
  Todo.create(
    {
      text: req.body.text,
      done: false,
      // editing: false
    },
    function (err, todo) {
      if (err) res.send(err);

      // get and return all the todos after you create another
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
      });
    }
  );
});


app.put("/api/todos/:todo_id", function (req, res) {
  Todo.findByIdAndUpdate(
    req.params.todo_id,
    {
      text: req.body.text,
      done: req.body.done
    },
    // {new: true},
    function (err, todo) {
      if (err) res.send(err);

      // get and return all the todos after you change another
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
      });
    }
  )
});

app.put("/api/todos/done/:todo_id", function (req, res) {
  let todo_text, todo_done;
  Todo.findById(req.params.todo_id,
    function (err, todos) {
      if (err) res.send(err);
      // todo_text = todos.text;
      // todo_done = todos.done;
      isDone = todos.done;
      console.log("B4: ", isDone);
      // res.json(todo_done); 
    }
  );
  // console.log("xds");
  // sleep(1000);
  console.log("in: ", isDone);
  Todo.findByIdAndUpdate(
    req.params.todo_id,
    {
      done: !isDone
    },
    function (err, todo) {
      if (err) res.send(err);
      Todo.find(function (err, todos) {
        console.log("After: ", isDone);
        if (err) res.send(err);
        res.json(todos);
      });
    }
  )  
});

// delete a todo
app.delete("/api/todos/:todo_id", function (req, res) {
  Todo.remove(
    {
      _id: req.params.todo_id,
    },
    function (err, todo) {
      if (err) res.send(err);

      // get and return all the todos after you delete another
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
      });
    }
  );
});

// application -------------------------------------------------------------
app.get("*", function (req, res) {
  res.sendFile("./public/index.html", { root: __dirname });
});

// listen (start app with node server.js) ======================================
var server = http.createServer(app);
server.listen(app.get("port"), function () {
  console.log("Express server listening on: http://localhost:" + app.get("port"));
});
