const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.set("view engine", "ejs");

let itemzip=["Buy Food","Cook Food","Eat Food"];


app.get("/", (req, res) => {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  day = today.toLocaleDateString("en-US", options);

  res.render("list", { day: day, todo: itemzip });
});

app.post("/", (req, res) => {
todo = String(req.body.todo);
itemzip.push(todo)
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
