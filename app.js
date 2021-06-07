const express = require("express");
const bodyParser = require("body-parser");
const getDate=require(__dirname+"/date.js")

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.set("view engine", "ejs");

let workitems=[];
let itemzip=["Buy Food","Cook Food","Eat Food"];


app.get("/", (req, res) => {
  day=getDate.getDate();  
  res.render("list", { day: day, todo: itemzip });
});

app.get("/work",(req,res)=>{
  res.render("list",{day:"Work", todo:workitems})
})

app.post("/", (req, res) => {
console.log(req.body)
todo = String(req.body.todo);
if (req.body.btn=="Work"){
  workitems.push(todo)
  res.redirect("/work")
}
else{
  itemzip.push(todo);

  res.redirect("/");
}
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
