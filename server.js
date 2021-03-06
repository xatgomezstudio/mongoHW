var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

////////////////////////////////////////////////// CONFIGURE MIDDLEWARE

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

////////////////////////////////////////////////// CONFIGURE HANDLEBARS
// var exphhbs = require("express-handlesbars");

// app.engine(
//     "hanldebars",
//     exphbs({
//         defaultLayout: "main",
//     })
// );
// app.set("view engine", "handlebars");

////////////////////////////////////////////////// API ROUTES
require("./routes/articles-routes")(app);
require("./routes/comment-routes")(app);

////////////////////////////////////////////////// MONGO CONNECTION
mongoose.connect("mongodb://localhost/rhizomedb", { useNewUrlParser: true });

////////////////////////////////////////////////// START SERVER
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});