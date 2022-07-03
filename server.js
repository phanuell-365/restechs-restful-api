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
const Delivery = require("./models/delivery.model");
const Sale = require("./models/sales.model");

// require routes

const drugsRoutes = require("./routes/drugs/drugs.routes");
const drugsIdRoutes = require("./routes/drugs/drugs.id.routes");
const suppliersRoutes = require("./routes/suppliers/suppliers.routes");
const suppliersIdRoutes = require("./routes/suppliers/suppliers.id.routes");
const ordersRoutes = require("./routes/orders/orders.routes");
const ordersIdRoutes = require("./routes/orders/orders.id.routes");
const salesRoutes = require("./routes/sales/sales.routes");
const salesIdRoutes = require("./routes/sales/sales.id.routes");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());


// use routes

app.use(drugsRoutes);
app.use(drugsIdRoutes);
app.use(suppliersRoutes);
app.use(suppliersIdRoutes);
app.use(ordersRoutes);
app.use(ordersIdRoutes);
app.use(salesRoutes);
app.use(salesIdRoutes);

// define the relationship between the models

Drug.hasMany(Order, {constraints: true, onDelete: "CASCADE"});
Order.belongsTo(Drug);
Supplier.hasMany(Order, {constraints: true, onDelete: "CASCADE"});
Order.belongsTo(Supplier);
Drug.hasMany(Sale, {constraints: true, onDelete: "CASCADE"});
Sale.belongsTo(Drug);
Order.hasMany(Delivery, {constraints: true, onDelete: "CASCADE"});
Delivery.belongsTo(Order);

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