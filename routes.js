"use strict";

// code from Github
let isValidURL = function(url) {
  let regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return regex.test(url);
};

let count = 0;
let nextNum = function() {
  return count++;
};

module.exports = function(app, db) {

  app.route("/new/*").get(function(req, res) {
    console.log(req.originalUrl);
    let url = req.originalUrl.substring(5);
    console.log(url);
    if (isValidURL(url)) {
      let num = nextNum();
      res.json({
        original_url: url,
        short_url: `${process.env.APP_URL}/${num}`
      });
      db.collection("urls").insertOne({
        num: num,
        origin: url
      }, function(err, result) {
        if (err) {
          throw err;
        }
        console.log(`result: ${result}`);
      });
    } else {
      res.json({
        error: "The URL is not valid."
      })
    }
  });

  app.route("/:url").get(function(req, res) {
    console.log(req.params.url);
    let num = Number(req.params.url);
    if (!isNaN(num)) {
      db.collection("urls").findOne({
        num: num
      }, function(err, doc) {
        if (err) {
          throw err;
        }
        if (!doc) {
          return res.json({
            error: "URL not found!"
          });
        }
        return res.redirect(doc.origin);
      });
    } else {
      res.json({
        error: "This short URL does not exist in database."
      });
    }

  });
}
