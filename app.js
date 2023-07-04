const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

dotenv.config({ path: "./.env" });
require("./db/connection");

app.use(express.json());

app.use(require("./router/Auth"));

const User = require("./model/Schema");

const DB = process.env.DATABASE_URL;

const PORT = process.env.PORT || 3004;

// Middelware
// const middelware = (req, res, next) => {
//   console.log("Hello my middelware");
//   next();
// };

app.get("/", (req, res) => {
  res.send(`Hello world from the server app.js`);
});

// app.get("/about", (req, res) => {
//   console.log(`Hello my about`);
//   res.send(`Hello about world from the server`);
// });

// app.get("/contact", (req, res) => {
//   res.send(`Hello contact world from the server`);
// });

app.get("/signin", (req, res) => {
  res.send(`Hello Login  world from the server`);
});

app.get("/signup", (req, res) => {
  res.send(`Hello Registration world from the server`);
});

//heroku build
if(process.env.NODE_ENV == "production"){
  app.use(express.static("client/build"));
}

app.listen(PORT, () => {
  console.log(`Server is running at port on ${PORT}`);
});
