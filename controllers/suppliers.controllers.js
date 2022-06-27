// jshint esversion:9

"use strict";

const Supplier = require("../models/suppliers.model");

module.exports = {
    getSuppliers(req, res) {
        Supplier.findAll().then((suppliers) => {
            res.json(suppliers);
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to load all suppliers",
                err,
            });
        });
    },

    postSuppliers(req, res) {
        const {name, email, contact} = req.body;

        if (!name || !email || !contact) {
            res.json({
                errMsg: "Error! Not all fields were filled",
                body: req.body,
            });
        } else {
            Supplier.create({
                name,
                email,
                contact,
            }).then((supplier) => {
                return supplier.save();
            }).then((supplier) => {
                return supplier;
            }).then((supplier) => {
                res.json({
                    msg: "Successfully added the supplier.",
                    supplier,
                });
            }).catch((err) => {
                res.json({
                    errMsg: "Error! Failed to find the supplier",
                    err,
                });
            });
        }
    },

    deleteSuppliers(req, res) {

        Supplier.findAll().then((suppliers) => {
            suppliers.forEach((supplier) => {
                supplier.destroy().catch((err) => {
                    res.json({
                        errMsg: `Error! Failed to delete a supplier`,
                        err,
                    });
                });
            });
            return suppliers;
        }).then((suppliers) => {
            res.json({
                msg: "The suppliers were deleted successfully",
                suppliers,
            });
        }).catch((err) => {
            res.json({
                msgErr: "Error! Failed to delete all suppliers",
                err,
            });
        });
    }
};