// jshint esversion:9

"use strict";

const Sale = require("../models/sales.model");
const Drug = require("../models/drugs.model");
const {updateDrugQuantity, calcTotalPrice} = require("../src/sales.src");

module.exports = {

    getSales(req, res) {

        Sale.findAll().then((sales) => {
            res.json(sales);
        }).catch(err => {
            res.json({
                errMsg: "Error! Failed to load all sales.",
                err,
            });
        });
    },

    postSales(req, res) {

        const {quantity, price, DrugId} = req.body;

        if (!quantity || !price || !DrugId) {
            res.json({
                errMsg: "Error! Not all fields were fed",
                body: req.body,
            });
        } else {
            Drug.findByPk(DrugId).then(async (drug) => {

                const totalVal = await calcTotalPrice(DrugId, quantity);

                return drug.createSale({
                    quantity,
                    price,
                    total: totalVal,
                });
            }).then((sale) => {
                // update the drug quantity
                updateDrugQuantity(DrugId, quantity);

                res.json({
                    msg: "Successfully created the sale.",
                    sale,
                });
            }).catch(err => {
                res.json({
                    errMsg: "Error! Failed to create the sale.",
                    err,
                });
            });
        }
    },

    deleteSales(req, res) {

        Sale.findAll().then((sales) => {

            const destroyedSales = [];

            sales.forEach((sale) => {

                sale.destroy().then((sale) => {
                    destroyedSales.push({...sale});
                }).catch((err) => {

                    res.json({
                        errMsg: "Error! Failed to destroy the sale",
                        err,
                    });
                });
            });

            res.json({
                msg: "Successfully deleted all the sales",
                destroyedSales,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to destroy the sale",
                err,
            });
        });
    },
};