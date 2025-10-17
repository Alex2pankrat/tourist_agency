const connectController = require("../Controllers/connectController.js");
const pool = connectController.pool;

//=========================================================
// Добавление тура в Корзину
//=========================================================
exports.addToCart = function (req, res) {
    const TourID = req.params.TourID;
    pool.query("SELECT * FROM tours WHERE TourID=?", [TourID], function (err, tours) {
        if (err) {
            console.log(err);
            return res.redirect("/tours");
        }

        if (tours.length > 0) {
            const tour = tours[0];
            const tourInCart = connectController.cart.find(item => item.TourID === tour.TourID);
            if (!tourInCart) {
                connectController.cart.push(tour);
            }
        }

        res.redirect("/tours");
    });
};


//=============================================
// Просмотр содержимого Корзины
//=============================================
exports.getCart = function (req, res) {
    const validCart = connectController.cart.filter(item => item && typeof item.Price !== 'undefined');
    const totalPrice = validCart.reduce((total, tour) => total + tour.Price, 0);

    pool.query("SELECT * FROM clients", function (err, clients) {
        if (err) return console.log(err);

        res.render("../Views/Sales/Cart.hbs", {
            cartTours: validCart,
            totalPrice: totalPrice,
            Clients: clients
        });
    });
};

//-----------------------------------------------
// Вызывается при оформлении Продажи
//-----------------------------------------------
exports.cartToHistory = function (req, res) {
    const clientID = req.body.ClientID;
    var saleDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    connectController.cart.forEach(tour => {
        pool.query("INSERT INTO sales (TourID, ClientID, SaleDate, FinalPrice) VALUES (?, ?, ?, ?)",
            [tour.TourID, clientID, saleDate, tour.Price], function (err) {
                if (err) console.log(err);
            });
    });

    connectController.cart = [];

    res.redirect("/tours");
};


//==================================================
// Просмотр  истории покупок Клиента
//==================================================
exports.getHistory = function (req, res) {

    const ClientID = req.params.ClientID;

    pool.query("SELECT * FROM sales WHERE ClientID=?", 
                     [ClientID], function (err, history) {
        if (err) return console.log(err);

        
        res.render("../Views/Sales/History.hbs", {
            History: history
        });
    });
};