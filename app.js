require('dotenv').config();

//===================================================
// Настройка express
//===================================================
const express = require("express");
const app = express();

// Включение Парсера
app.set("view engine", "hbs");
const urlencodedParser = express.urlencoded({ extended: false });

//======================================================
// Определение корневых маршрутов приложения
//======================================================
const homeRouter = require("./routes/homeRouter.js");
const tourRouter = require("./routes/tourRouter.js");
const clientRouter = require("./routes/clientRouter.js");
const saleRouter = require("./routes/saleRouter.js");

app.use("/tours", urlencodedParser, tourRouter);
app.use("/clients", urlencodedParser, clientRouter);
app.use("/sales", urlencodedParser, saleRouter);
app.use("/", homeRouter);

//========================================================
app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

console.log("Server is ready to Connect...!")
app.listen(3000);
