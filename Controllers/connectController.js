const mysql = require("mysql2");

const pool = mysql.createPool({
   		connectionLimit: 5,
   		host: "localhost",
    		user: "root",
   	 	database: "tourist_agency", // Наименование базы данных
    		password: process.env.DB_PASSWORD,
        authPlugin: 'mysql_native_password'
})

let cart = []; // Корзина в виде массива

module.exports.pool = pool;
module.exports.cart = cart;