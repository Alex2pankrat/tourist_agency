require('dotenv').config();

const express = require("express");
const app = express();

app.set("view engine", "hbs");
const urlencodedParser = express.urlencoded({ extended: false });

const homeRouter = require("./Routes/homeRouter.js");
const tourRouter = require("./Routes/tourRouter.js");
const clientRouter = require("./Routes/clientRouter.js");

app.use("/", homeRouter);
app.use("/tours", urlencodedParser, tourRouter);
app.use("/clients", urlencodedParser, clientRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

console.log("app is running on 3000 port..")
app.listen(3000);
