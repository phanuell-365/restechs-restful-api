// jshint esversion:9

"use strict";

const Order = require("../models/orders.model");
const {calcOrderValue, calcDrugQuantity} = require("../src/orders.controllers.src");
// const {or} = require("sequelize/types");

module.exports = {

    getOrdersId(req, res) {

        const orderId = req.params.id;

        Order.findByPk(orderId).then((order) => {
            res.json(order);
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to find the order",
                err,
            });
        });
    },

    putOrdersId(req, res) {

        const orderId = req.params.id;
        const {status, quantity, supplierId, DrugId} = req.body;

        if (!status || !quantity || !supplierId || !DrugId) {
            res.json({
                errMsg: "Error! Not all fields were fed.",
                body: req.body,
            });
        } else {

            Order.findByPk(orderId).then(async (order) => {

                calcDrugQuantity(quantity, DrugId);

                return order.update({
                    status,
                    quantity,
                    value: await calcOrderValue(quantity, DrugId),
                    SupplierId: supplierId,
                    DrugId: DrugId,
                });
            }).then((order) => {
                return order;
            }).then((order) => {
                res.json({
                    msg: "Successfully updated the order",
                    order,
                });
            }).catch((err) => {
                res.json({
                    errMsg: "Error! Failed to update the order",
                    err,
                });
            });
        }
    },

    patchOrderId(req, res) {

        const orderId = req.params.id;

        Order.findByPk(orderId).then(async (order) => {

            if (!req.body.quantity) {
                // console.log("Patched order", req.body);
                return order.update(req.body);
            } else {

                // re-evaluate the drug's quantity
                calcDrugQuantity(req.body.quantity, order.DrugId);

                const orderValue = (await (async () => {
                    return await calcOrderValue(req.body.quantity, order.DrugId);
                })());

                return order.update({
                    quantity: req.body.quantity,
                    value: orderValue,
                });
            }
        }).then((order) => {
            res.json({
                msg: "Successfully updated the order",
                order,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to update the order",
                err,
            });
        });
    },

    deleteOrdersId(req, res) {

        const orderId = req.params.id;

        Order.findByPk(orderId).then((order) => {
            return order.destroy();
        }).then((order) => {
            res.json({
                msg: "Successfully deleted the order",
                order,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to destroy the order",
                err,
            });
        });
    },
};
