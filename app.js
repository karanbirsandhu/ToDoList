const express = require("express");
const bodyParser = require("body-parser");
const getDate = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

// connecting mongoose
mongoose.connect("mongodb+srv://karan1993sandhu:Amrit1313@firstcluster.n6av3.mongodb.net/toDoListDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology:true
});

// let workitems=[];
let itemzip = [];

// Mongoose schema

const itemSchema = {
  name: String,
};
// creating a model

const Item = mongoose.model("Item", itemSchema);

// creating item docs
const firstItem = new Item({
  name: "Welcome to your todo list!!",
});

const secItem = new Item({
  name: "Hit the + button to add new items",
});

const thirdItem = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [firstItem, secItem, thirdItem];

const listSchema={
  name:String,
  items:[itemSchema] //creates itemschema based array
}

const List=mongoose.model("List",listSchema)

app.get("/", (req, res) => {
  // check if default items are there or not to insert

  // fetching items from DBs

  Item.find((err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length == 0) {
        Item.insertMany(defaultItems, (err) => {
          // inserting docs to DB
          if (err) {
            console.log(err);
          } else {
            console.log("default items added to DB");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", { day: "Today", todo: results });
      }
    }
  });


});


app.get("/:listtype",(req,res)=>{
  const customlisttype=req.params.listtype

  List.findOne({name:customlisttype},(err,results)=>{
    if (!results){
      const list=new List ({
        name:customlisttype,
        items:defaultItems
    
      })
      
    
      list.save(()=>{
        res.redirect("/"+customlisttype)
      })
      
    }
    else{
    res.render("list",{day:results.name,todo:results.items})
    }
  })

  
})




app.post("/", (req, res) => {
  const itemName = req.body.todo;

  const newItem = new Item({
    name: itemName,
    items:defaultItems
  });
  newItem.save();
  res.redirect("/");
});





app.post("/del",(req,res)=>{
  const itemId=req.body.del
  const listName=req.body.listName

  
  if(listName==="Today"){
    Item.findByIdAndDelete(itemId,(err)=>{
      if(err){
        console.log(err)
      }
      res.redirect('/')
    }); 
  }
  else{
    List.findOneAndUpdate({"name":listName},{$pull:{ items: {"_id":itemId}}},{new:true},(err,response)=>{
      if(err){
        console.log(err)
      }
      else{
        
        res.redirect("/"+listName)
      }

    })
   
    
  }
});

// Dynamic API always placed at bottom
app.post("/:listtype",(req,res)=>{
  const listtypename = req.params.listtype;

  const itemName = req.body.todo;

  const newItem = new Item({
    name: itemName
  });

  if (listtypename=="Today"){
    newItem.save();
    res.redirect('/')

  }
  else{
    List.findOne({name:listtypename},(err,results)=>{
      if(err){
        console.log(err)
      }
      if(!results){
        console.log("nothingfound"+listtypename)
      }
      else{

      results.items.push(newItem)
      results.save(()=>{res.redirect("/"+ listtypename)});
      }
      
    })
  }

  

})

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
