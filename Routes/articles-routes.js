/////////////////////////////////////////////////////////////////////////////////////////
module.exports = (app) => {

    // Require all models
    var db = require("../models");

    // Our scraping tools
    // Axios is a promised-based http library, similar to jQuery's Ajax method
    // It works on the client and on the server
    var axios = require("axios");
    var cheerio = require("cheerio");

    // ARTICLE Routes

    //////SCRAPE route, a GET for scraping the website:: Route
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        console.log("endpoint fired");
        axios.get("https://rhizome.org//").then(function (response) {
            console.log("call retrieved");
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            //TITLE AND URL

            // Now, we grab every h3 within an article tag, and do the following:
            $("h3.primary").each(function (i, element) {
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

                //SUMMARY

                // Now, we grab every h3 within an article tag, and do the following:
                $("item-caption").each(function (i, element) {
                    console.log("summary grabbed");
                    // Save an empty result object
                    var result = {};

                    // Add the text and href of every link, and save them as properties of the result object
                    result.summary = $(this)
                        .text("p");

                    console.log(result);

                    // Create a new Article using the `result` object built from scraping
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            // View the added result in the console
                            console.log(dbArticle);
                        })
                        .catch(function (err) {
                            // If an error occurred, log it
                            console.log(err);
                        });
                });

                // Send a message to the client
                res.send("Scrape Complete");
            });
        });
    });

    //////ACCESSING ALL articles:: Route

    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    ////ACCESSING ONE article:: Route

    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the comments associated with it
            .populate("comment")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    //////SAVING new article:: Route

    // app.get("/article", function (req, res) {
    //     // Grab every document in the Articles collection
    //     db.Article.insert({})
    //         .then(function (dbArticle) {
    //             // If we were able to successfully find Articles, send them back to the client
    //             res.json(dbArticle);
    //         })
    //         .catch(function (err) {
    //             // If an error occurred, send it to the client
    //             res.json(err);
    //         });
    // });


}
