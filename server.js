// jshint esversion:9

"use strict";

require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;

// require models

const sequelize = require("./config/config.db");
const Drug = require("./models/drugs.model");
const Supplier = require("./models/suppliers.model");
const Order = require("./models/orders.model");
const Sale = require("./models/sales.model");

// require routes

const drugsRoutes = require("./routes/drugs.routes");
const drugsIdRoutes = require("./routes/drugs.id.routes");

app.use(bodyParser.urlencoded({extended: true}));

// use routes

app.use(drugsRoutes);
app.use(drugsIdRoutes);

// define the relationship between the models

Drug.hasMany(Order, {constraints: true, onDelete: "CASCADE"});
Order.belongsTo(Drug);
Supplier.hasMany(Order, {constraints: true, onDelete: "CASCADE"});
Order.belongsTo(Supplier);
Drug.hasMany(Sale, {constraints: true, onDelete: "CASCADE"});
Sale.belongsTo(Drug);

sequelize
    // .sync({force: true}) // drops all tables, and creates new ones
    .sync()
    .then((result) => {
        // console.log(result);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}!`)
        );
    })
    .catch((err) => {
        console.log(err);
    });