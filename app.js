const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB" , {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title : String , 
  content : String 
};

// This is Model
const Article = mongoose.model("Article" , articleSchema);   // First Parameters is article and second is schema 


///////////////////////////////        Request Targating All Articles         ////////////////////////////

app.route("/articles")

  .get(function(req,res){
    Article.find(function(err,foundArticles){
      if(!err){
        res.send(foundArticles);
      }  
      else{
        res.send(err);
      }
    });
  })

  .post(function(req,res){
    const newArticle = new Article({
      title : req.body.title,
      content : req.body.content
    })
    newArticle.save(function(err){
      if(!err){
        res.send("succesfully Added a new article ");
      }  
      else{
        res.send(err);
      }
    });
  })

  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("All Articles are Deleted")
      }
      else{
        res.send(err);
      }
    })
  });

///////////////////////////////        Request Targating A Specific Articles         ////////////////////////////

app.route("/articles/:articleTitle")
  
  .get(function(req,res){
    Article.findOne({title : req.params.articleTitle} , function(err , foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }
      else{
        res.send("No Article matched found ")
      }
    })
  })

  .put(function(req,res){
    Article.updateOne(
      {title : req.params.articleTitle},
      {title : req.body.title , content : req.body.content},
      {upsert: true},
      function(err){
        if(!err){
          res.send("Successfully Updated the selected Article");
        }
      }
    );
  })

  .patch(function(req,res){
    Article.updateOne(
      {title : req.params.articleTitle},
      {$set : req.body},
      function(err){
        if(!err){
          res.send("Successfully Updated Article")
        }
        else{
          res.send(err);
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title : req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Successfully Deleted");
        }
        else{
          res.send(err);
        }
      }
    )
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});