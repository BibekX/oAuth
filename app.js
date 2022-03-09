const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const setupPassport = require("./passport");
const router = require("./router")(express);
const bcrypt = require("./bcrypt");
const port = 3000;

const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

app.use(flash());
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

setupPassport(app, bcrypt);

app.use("/", router);

https.createServer(options, app).listen(port, () => {
  console.log("Listening to port 3000");
});
