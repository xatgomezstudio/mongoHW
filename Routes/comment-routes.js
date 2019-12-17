/////////////////////////////////////////////////////////////////////////////////////////

module.exports = (app) => {

  // Require all models
  var db = require("../models");

  // COMMENTS Routes

  //SUBMITTING all comment information to db:: Route

  app.post("/comment", function (req, res) {
    // Create a new user using req.body
    comment.create(req.body)
      .then(function (dbcomment) {
        // If saved successfully, send the the new comment document to the client
        res.json(dbcomment);
      })
      .catch(function (err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });

  //////ACCESSING ALL comments:: Route

  app.get("/comments", function (req, res) {
    // Grab every document in the comments collection
    db.comment.find({}).pretty()
      .then(function (dbcomment) {
        // If we were able to successfully find comments, send them back to the client
        res.json(dbcomment);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  ////ACCESSING ONE comment:: Route

  app.get("/comments/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.comment.findOne({ _id: req.params.id })
      // ..and populate all of the comments associated with it
      .populate("comment")
      .then(function (dbcomment) {
        // If we were able to successfully find an comment with the given id, send it back to the client
        res.json(dbcomment);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
}