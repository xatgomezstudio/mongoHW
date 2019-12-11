var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// // Handlebars Setup
// var exphhbs = require("express-handlesbars");

// app.engine(
//     "hanldebars",
//     exphbs({
//         defaultLayout: "main",
//     })
// );
// app.set("view engine", "handlebars");
// require("./routes/html-routes")(app);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/rhizomedb", { useNewUrlParser: true });

/////////////////////////////////////////////////////////////////////////////////////////

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    console.log("endpoint fired");
    axios.get("https://rhizome.org//").then(function(response) {
        console.log("call retrieved");
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h3 within an article tag, and do the following:
      $("h3.primary").each(function(i, element) {
          console.log("element grabbed");
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
        .text();

        result.link = $(this)
          .parent("a")
          .attr("href");
    
          console.log(result);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

// Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//       .then(function(dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });