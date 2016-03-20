var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var index = require("./routes/index.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", index);

app.set("port", (process.env.PORT || 3000));

app.listen(app.get("port"), function(){
    console.log("Listening on Port:", app.get("port"));
});
