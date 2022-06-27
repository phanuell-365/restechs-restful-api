// jshint esversion:9

"use strict";

const Order = require("../models/orders.model");
const Supplier = require("../models/suppliers.model");
const {calcOrderValue, calcDrugQuantity} = require("../src/orders.controllers.src");

module.exports = {

    getOrders(req, res) {
        Order.findAll().then((orders) => {
            res.json(orders);
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to collect all the records",
                err,
            });
        });
    },

    postOrders(req, res) {

        const {status, quantity, supplierId, drugId} = req.body;

        if (!status || !quantity || !supplierId || !drugId) {
            res.json({
                errMsg: "Error! Not all fields were fed.",
                body: req.body,
            });
        } else {

            Supplier.findByPk(supplierId).then(async (supplier) => {
                // calculate the quantity of the drug delivered and update the drug info
                calcDrugQuantity(quantity, drugId);


                // create a new order while calculating its order value.
                return supplier.createOrder({
                    status,
                    quantity,
                    value: await calcOrderValue(quantity, drugId),
                    DrugId: drugId,
                });
            }).then((supplier) => {
                res.json({
                    msg: "Successfully created an order.",
                    supplier,
                });
            }).catch((err) => {
                res.json({
                    errMsg: "Error! Failed to create the order.",
                    err,
                });
            });
        }

    },

    deleteOrders(req, res) {

        Order.findAll().then((orders) => {
            orders.forEach((order) => {
                order.destroy().catch((err) => {
                    res.json({
                        errMsg: "Error! Failed to destroy an order.",
                        err,
                    });
                });
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to destroy an order.",
                err,
            });
        });
    }
};