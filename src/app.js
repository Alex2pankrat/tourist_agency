require('dotenv').config();

const express = require("express");
const app = express();

app.set("view engine", "hbs");
const urlencodedParser = express.urlencoded({ extended: false });

const homeRouter = require("./Routes/homeRouter.js");
const tourRouter = require("./Routes/tourRouter.js");
const clientRouter = require("./Routes/clientRouter.js");
const saleRouter = require("./Routes/saleRouter.js");

app.use("/tours", urlencodedParser, tourRouter);
app.use("/clients", urlencodedParser, clientRouter);
app.use("/sales", urlencodedParser, saleRouter);
app.use("/", homeRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

console.log("Server is ready to Connect...!")
app.listen(3000);
