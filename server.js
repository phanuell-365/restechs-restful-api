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
const suppliersRoutes = require("./routes/suppliers.routes");
const suppliersIdRoutes = require("./routes/suppliers.id.routes");
const ordersRoutes = require("./routes/orders.routes");

app.use(bodyParser.urlencoded({extended: true}));


// use routes

app.use(drugsRoutes);
app.use(drugsIdRoutes);
app.use(suppliersRoutes);
app.use(suppliersIdRoutes);
app.use(ordersRoutes);

// define the relationship between the models

Drug.hasOne(Order, {constraints: true, onDelete: "CASCADE"});
Order.belongsTo(Drug);
Supplier.hasMany(Order, {constraints: true, onDelete: "CASCADE"});
Order.belongsTo(Supplier);
Drug.hasOne(Sale, {constraints: true, onDelete: "CASCADE"});
Sale.belongsTo(Drug);

sequelize
    // .sync({force: true}) // drops all tables, and creates new ones
    .sync()
    .then(() => {
        // console.log(result);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}!`)
        );
    })
    .catch((err) => {
        console.log(err);
    });