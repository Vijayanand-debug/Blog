//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose= require("mongoose");
const _ = require("lodash");


const app = express();
app.set('view engine', 'ejs');


//establishing and creating a database
mongoose.connect('mongodb://localhost/blogpostDB', {useNewUrlParser: true, useUnifiedTopology: true});



const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien."; 


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//creating a schema

const blogSchema= new mongoose.Schema({

      title: String,
      content: String
});

//turning the Schema in to a model 

const Blog= mongoose.model('Blog', blogSchema);


let posts = [];

app.get("/", function(req, res){
 
 Blog.find({},function(err,docs){
          if(docs){
                  res.render("home",{posts:docs});
                  
         } else{
                res.render("home",{posts:[]});
          }
 });
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
   
   const newPost = new Blog({
    title: (req.body.postTitle).trim(),
    content: req.body.postBody
  });
  
  newPost.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
    
    const deleteId= (req.body.deleteThis);
    Blog.findByIdAndDelete({_id:deleteId},function(err,docs){
         if(err){
                 console.log(err);      
         }
    });
    res.redirect("/");
  
});
app.get("/posts/:postName", function(req, res){
  const requestedTitle = (req.params.postName);
  
  Blog.findOne({title:requestedTitle},function(err,docs){
       if(docs){   
                res.render("post", {title: docs.title,content: docs.content});
       }
 });             
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
