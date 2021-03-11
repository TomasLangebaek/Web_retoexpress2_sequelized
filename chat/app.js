var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Joi = require("joi");
var fs = require("fs");

var indexRouter = require("./routes/index");
var messagestRouter = require("./routes/message");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/chat/api/messages", messagestRouter);

module.exports = app;
