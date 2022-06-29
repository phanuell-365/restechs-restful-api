// jshint esversion:9

"use strict";

const Sale = require("../../models/sales.model");
const {calcTotalPrice} = require("../../src/sales/sales.src");
const {calcSellingPrice} = require("../../src/sales/sales.id.src");

module.exports = {

    getSalesId(req, res) {

        const saleId = req.params.id;

        Sale.findByPk(saleId).then((sale) => {

            res.json(sale);
        }).catch((err) => {

            res.json({
                errMsg: "Error! Failed to locate the sale.",
                err,
            });
        });
    },

    putSalesId(req, res) {

        const saleId = req.params.id;

        const {quantity, DrugId} = req.body;

        if (!quantity || !DrugId) {
            res.json({
                errMsg: "Error! Not all fields were fed",
                body: req.body,
            });
        } else {
            Sale.findByPk(saleId).then(async (sale) => {


                const totalVal = await calcTotalPrice(DrugId, quantity);

                const newDrugPrice = (await calcSellingPrice(DrugId));
                return sale.update({
                    quantity,
                    price: newDrugPrice,
                    total: totalVal,
                });
            }).catch((err) => {
                res.json({
                    errMsg: "Error! Failed to update the sale",
                    err,
                });
            });
        }
    },

    patchSalesId(req, res) {

        const saleId = req.params.id;

        Sale.findByPk(saleId).then(async (sale) => {

            if (req.body.quantity && !req.body.DrugId) {

                const totalVal = await calcTotalPrice(sale.DrugId, req.body.quantity);

                return sale.update({
                    quantity: req.body.quantity,
                    total: totalVal,
                });
            } else if (!req.body.quantity && req.body.DrugId) {

                const totalVal = await calcTotalPrice(req.body.DrugId, sale.quantity);
                const drugPrice = await calcSellingPrice(req.body.DrugId);

                return sale.update({
                    DrugId: req.body.DrugId,
                    price: drugPrice,
                    total: totalVal,
                });
            } else if (req.body.quantity && req.body.DrugId) {

                const totalVal = await calcTotalPrice(req.body.DrugId, req.body.quantity);
                const drugPrice = await calcSellingPrice(req.body.DrugId);

                return sale.update({
                    quantity: req.body.quantity,
                    price: drugPrice,
                    total: totalVal,
                    DrugId: req.body.DrugId,
                });
            }
        }).then((sale) => {
            res.json({
                msg: "Successfully updated the sales",
                sale,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to update the sale",
                err,
            });
        });
    },

    deleteSalesId(req, res) {

        Sale.findByPk(req.params.id).then((sale) => {
            return sale.destroy();
        }).then((sale) => {
            res.json({
                msg: "Successfully deleted the sale",
                sale,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to delete the sale",
                err,
            });
        });
    },
};