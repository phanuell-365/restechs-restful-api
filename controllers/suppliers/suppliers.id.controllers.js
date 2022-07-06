// jshint esversion:9

"use strict";

const Supplier = require("../../models/suppliers.model");
const CustomError = require("../../error/CustomError.error");

module.exports = {

    getSupplierById(req, res, next) {

        const supplierId = req.params.id;

        Supplier.findByPk(supplierId)

            .then((supplier) => {

                res.status(200).json(supplier);

            }).catch(next);
    },

    putSupplierById(req, res, next) {

        Promise.resolve()

            .then(() => {

                const supplierId = req.params.id;

                return Supplier.findByPk(supplierId);

            })
            .then((supplier) => {

                if (res.locals.validSupplierInfo) {

                    console.log("Previous supplier info -> ", supplier.toJSON());

                    const validSupplierInfo = res.locals.validSupplierInfo;

                    return supplier.update(validSupplierInfo);

                } else {

                    throw new CustomError({
                        description: "The Server encountered an error while extracting valid supplier info!",
                        status: 500,
                    }, "The Server encountered an error while extracting valid supplier info!");

                }

            })
            .then((supplier) => {

                console.log("Successfully updated the supplier", supplier.toJSON());

                res.status(200).json({
                    description: "Successfully updated the supplier",
                });

            })
            .catch(next);


    },

    patchSupplierById(req, res, next) {

        Promise.resolve().then(() => {

            const supplierId = req.params.id;

            return Supplier.findByPk(supplierId);

        })
            .then((supplier) => {

                console.log("Previous supplier info -> ", supplier.toJSON());

                if (res.locals.validSupplierInfo) {

                    const validSupplierInfo = res.locals.validSupplierInfo;

                    return supplier.update(validSupplierInfo);
                } else {

                    throw new CustomError({
                        description: "The Server encountered an error while extracting valid supplier info!",
                        status: 500,
                    }, "The Server encountered an error while extracting valid supplier info!");
                }

            })
            .then((supplier) => {

                console.log("Successfully updated the supplier", supplier.toJSON());

                res.status(200).json({
                    description: "Successfully updated the supplier",
                });

            })
            .catch(next);
    },

    deleteSupplierById(req, res) {

        const supplierId = req.params.id;

        Supplier.findByPk(supplierId)
            .then((supplier) => {
                return supplier.destroy();
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