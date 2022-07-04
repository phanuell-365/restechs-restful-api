// jshint esversion:9

"use strict";

const Supplier = require("../../models/suppliers.model");

module.exports = {

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    getSuppliers(req, res, next) {
        Supplier.findAll()
            .then((suppliers) => {

                console.log(res.locals);

                suppliers.forEach(supplier => console.log(supplier.toJSON()));

                res.status(200).json(suppliers);

            })
            .catch(next);
    },

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    postSuppliers(req, res, next) {

        if (res.locals.validSupplierInfo) {

            const validSupplierInfo = res.locals.validSupplierInfo;

            console.log(validSupplierInfo);

            Supplier.findOrCreate({
                where: {
                    name: req.body.name,
                },
                defaults:validSupplierInfo,
            })
                .then(([supplier, created]) => {

                    if (created) {
                        console.log("Successfully created the supplier ->", supplier.toJSON());
                        res.status(201).json({
                            description: "Successfully added the supplier into the database",
                        });
                    } else {
                        res.status(400).json({
                            description: "The supplier already exists.",
                        });
                    }

                })
                .catch(next);

        } else {

            res.status(500).json({
                description: "The Server encountered an error while extracting valid supplier info!"
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