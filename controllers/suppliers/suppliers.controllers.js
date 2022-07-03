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

            Supplier.create(validSupplierInfo)
                .then((supplier) => {

                    if (!res.locals.supplierExists) {

                        return supplier.save();
                    } else {

                        res.status(400).json({
                            description: `Error! The supplier with the data ${Object.values(req.body)} already exists`,
                        });
                    }
                })
                .then((supplier) => {


                    console.log("Successfully created the supplier ->", supplier.toJSON());

                    res.status(201).json({
                        description: "Successfully added the supplier into the database",
                    });
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