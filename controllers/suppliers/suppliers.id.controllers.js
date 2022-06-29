// jshint esversion:9

"use strict";

const Supplier = require("../../models/suppliers.model");

module.exports = {

    getSuppliersId(req, res) {
        const supplierId = req.params.id;

        Supplier.findByPk(supplierId).then((supplier) => {
            res.json(supplier);
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to get the supplier",
                err,
            });
        });
    },

    putSuppliersId(req, res) {

        const supplierId = req.params.id;

        Supplier.findByPk(supplierId).then((supplier) => {

            const {name, email, contact} = req.body;

            if (!name || !email || !contact) {
                res.json({
                    errMsg: "Error! Not all fields were filled",
                    body: req.body,
                });
            } else {
                supplier.update({
                    name, email, contact
                }).then((supplier) => {
                    return supplier.save();
                }).then((supplier) => {
                    res.json({
                        msg: "Successfully updated the supplier data",
                        supplier
                    });
                }).catch((err) => {
                    res.json({
                        errMsg: "Error! Failed to update the supplier's data",
                        err,
                    });
                });
            }
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to update the supplier's data",
                err,
            });
        });
    },

    patchSuppliersId(req, res) {
        const supplierId = req.params.id;

        Supplier.findByPk(supplierId).then((supplier) => {
            return supplier.update(req.body);
        }).then((supplier) => {
            return supplier;
        }).then((supplier) => {
            res.json({
                msg: "Successfully updated the supplier's data",
                supplier,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to update the supplier's data",
                err,
            });
        });
    },

    deleteSuppliersId(req, res) {

        const supplierId = req.params.id;

        Supplier.findByPk(supplierId).then((supplier) => {
            return supplier.destroy();
        }).then((supplier) => {
            return supplier;
        }).then((supplier) => {
            return supplier;
        }).then((supplier) => {
            res.json({
                msg: "Successfully deleted the supplier",
                supplier,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to delete the supplier",
                err,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to delete the supplier",
                err,
            });
        });
    },
};