// jshint esversion:9

"use strict";

const Supplier = require("../../models/suppliers.model");
const CustomError = require("../../error/CustomError.error");

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

                console.log("Displaying all suppliers ...");
                res.status(200).json(suppliers);

            })
            .catch(next);
    },

    /**
     *
     * @param req The request object
     * @param res The response object
     * @param next
     */
    postSuppliers(req, res, next) {

        Promise.resolve()

            .then(() => {

                if (res.locals.validatedSupplierInfo) {

                    const validSupplierInfo = {...res.locals.validatedSupplierInfo};

                    console.log("Valid supplier info to add into the database => ", validSupplierInfo);

                    return Supplier.findOrCreate({
                        where: {
                            name: validSupplierInfo.name,
                        },
                        defaults: {
                            name: validSupplierInfo.name,
                            email : validSupplierInfo.email,
                            contact : validSupplierInfo.contact,
                        },
                    });

                } else {

                    throw new CustomError({
                        description: "The Server encountered an error while extracting valid supplier info!",
                        status: 500,
                    }, "The Server encountered an error while extracting valid supplier info!");
                }


            })

            .then(([supplier, created]) => {

            if (created) {

                console.log("Successfully created the supplier ->", supplier.toJSON());

                res.status(201).json({
                    description: "Successfully added the supplier into the database",
                });

            } else {

                throw new CustomError({
                    description: "The Supplier already exists in the database!",
                    status: 400,
                }, "The Supplier already exists in the database!");
            }

        })
            .catch(next);


    },

    /**
     * @description Handles the post requests to the /drugs route
     * @param req
     * @param res
     */
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