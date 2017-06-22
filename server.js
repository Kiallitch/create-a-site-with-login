const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const app = express();
const port = process.env.PORT || 7000;

var users = [];

//Set View Engine
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

//MIDDLEWARE
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));

//ROUTES
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.redirect("/login");
  }
  var requestingUser = req.body; //clarification
  var userRecord; //clarification

  users.forEach(function(item) {
    console.log(item);
    if (item.username === requestingUser.username);
    {
      userRecord = item;
    }
  });
  if (!userRecord) {
    return res.redirect("/login"); //user not found
  }
  if (requestingUser.password === userRecord.password) {
    req.session.user = userRecord;
    return res.redirect("/profile");
  } else {
    return res.redirect("/login");
  }
});

app.get("profile", function(req, res) {
  res.render("profile");
});

app.listen(port, function() {
  console.log("This port is running on port: ", port);
});
