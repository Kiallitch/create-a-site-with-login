const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");
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
app.use(session(sessionConfig));
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
}

//ROUTES
app.get("/", function(req, res) {
  res.render("index");
}); //render your starting point with the index file

app.get("/signup", function(req, res) {
  res.render("signup");
}); //serve up your signup page with signup file

app.get("/login", function(req, res) {
  res.render("login");
}); //serve up your login page with your login file

app.post("/login", function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.redirect("/login");
  } //at the login page, if you don't have ANY characters(body) input at all and click the submit button,
  //redirect back to the login page.  if you don't input a username, or a password,
  //redirect back to the
  var requestingUser = req.body; //clarification
  var userRecord; //clarification

  users.forEach(function(item) {
    console.log(item);
    if (item.username === requestingUser.username);
    {
      userRecord = item; //clarification
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

app.get("/profile", function(req, res) {
  res.render("profile", { user: req.session.user });
});

app.post("/users", function(req, res) {
  console.log(req.body);
  if (!req.body || !req.body.username || !req.body.password) {
    return res.redirect("/");
  }
  var newUser = {
    username: req.body.username,
    password: req.body.password
  };

  users.push(newUser);
  console.log("user: ", users);
  return res.redirect("/login");
});

app.listen(port, function() {
  console.log("This port is running on port: ", port); //gets your local host online
});
