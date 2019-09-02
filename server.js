const dbcall = require("./dbcall.js");
const express = require("express");
const bodyParser = require("body-parser");
var app = express();
const Connection = require("tedious").Connection;
var sqlconfig = require("./config.js");
var connection = new Connection(sqlconfig);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send(
    "<h1> Neuen Kunden anlegen</h1>" +
      "<h2> V2 mit Connection Pooling</h2>" +
      '<form id="loginformA" action="/adduser" method="post"><div>' +
      '<label for="email">Email: </label> ' +
      '<input type="text" id="email" name="email"> </input><br><br>' +
      '<label for="email">User: </label> ' +
      '<input type="text" id="user" name="user"> </input><br><br>' +
      '<label for="password">Password: </label> ' +
      '<input type="text" id="password" name="password"> </input><br><br>' +
      ' </div><input type="submit" value="Submit"></input></form>'
  );
});

app.get("/getusers", (req, res) => {
  var users = "<ul>";
  dbcall.getCustomerList(connection, rows => {
    rows.forEach(element => {
      users += "<li>" + element[0].value + element[1].value + element[2].value + "</li>";
      console.log(element[0].value + element[1].value + element[2].value);
    });
    users += "<ul>";
    res.send("<h1>Benutzerliste</h1>" + users);
  });
});

app.post("/adduser", (req, res) => {
  console.log("Neuen Kunden anlegen:" + req.body.email);
  dbcall.SaveCustomerToDB(connection, req.body.email, req.body.user, req.body.password, duration => {
    console.log("fertig!");
    res.status(200).send("User " + req.body.user + " angelegt in " + duration + " Sekunden.");
    //res.send('alles gut!');
  });
});
app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
