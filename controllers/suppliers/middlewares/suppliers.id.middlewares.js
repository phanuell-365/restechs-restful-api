// jshint esversion:9

"use strict";

const Supplier = require("../../../models/suppliers.model");
const CustomError = require("../../../error/CustomError.error");
const SuppliersMiddlewares = require("../../../controllers/suppliers/middlewares/suppliers.middlewares");
const {supplierAttributes} = require("../../../data/suppliers/suppliers.data");

class SuppliersIdMiddlewares extends SuppliersMiddlewares {

    /**
     * @description - This middleware checks if the id attribute is passed in the request body.
     * @param req The request object
     * @param res The response object
     * @param next The next middleware
     */
    static checkIfAllSupplierInfoPresent(req, res, next) {

        if (req.method !== "GET" && req.method === "PUT") {

            Promise.resolve()

                .then(() => {

                    console.log("Checking if all the attributes are present");

                    const requestSupplierAttributes = Object.keys(req.body).sort();

                    const supplierAttrs = [...supplierAttributes];

                    requestSupplierAttributes.forEach((requestSupplierAttr) => {

                        const reqSupplierIndex = supplierAttrs.indexOf(requestSupplierAttr);

                        supplierAttrs.splice(reqSupplierIndex, 1);

                    });

                    console.log("The value of requestSupplierAttributes -> ", requestSupplierAttributes);
                    console.log("The value of supplierAttrs -> ", supplierAttrs);

                    if (supplierAttrs.length) {

                        throw new CustomError({
                            description: "Error!! Failed to update the supplier. The attributes " + supplierAttrs + " haven't be passed",
                            status: 400,
                        }, "Error!! Failed to update the supplier. The attributes " + supplierAttrs + " haven't be passed");
                    }

                    next();
                })
                .catch(next);

        } else {

            next();

        }

    }

    static checkIfIdAttrPassed(req, res, next) {

        if (req.method !== "GET") {

            Promise.resolve().then(() => {

                console.log("Checking if the id attribute is passed");

                const reqBodyKeys = Object.keys(req.body);

                if (reqBodyKeys.includes("id")) {

                    res.locals.isIdPassed = true;

                    throw new CustomError({
                        description: "The id is an auto-generated attribute. It can't be passed in the request body",
                        status: 400,
                    }, "The id is an auto-generated attribute. It can't be passed in the request body");

                } else {
                    res.locals.isIdPassed = false;

                    next();
                }
            })

                .catch(next);

        } else {

            next();

        }
    }

    /**
     * @description - This middleware checks if the id attribute is passed in the request body.
     * @param req The request object
     * @param res The response object
     * @param next The next middleware
     */
    static checkForDuplicateSupplierData(req, res, next) {

        if (req.method !== "GET") {

            Promise.resolve().then(() => {

                console.log("Validating if the supplier data is unique");

                const newSupplierDetails = res.locals.validatedSupplierDetails;

                if (req.method === "PATCH") {

                    return Supplier.findByPk(req.params.id)

                        .then((supplier) => {

                            return Supplier.findAndCountAll({

                                where: {
                                    name: newSupplierDetails.name || supplier.name,
                                    email: newSupplierDetails.email || supplier.email,
                                    contact: newSupplierDetails.contact || supplier.contact,
                                },
                            });
                        })
                        .catch(next);

                } else if (req.method === "PUT") {

                    return Supplier.findAndCountAll({

                        where: {
                            name: newSupplierDetails.name,
                            email: newSupplierDetails.email,
                            contact: newSupplierDetails.contact,
                        },
                    });
                }
            })
                .then(({count: length, rows: suppliers}) => {

                    const newSupplierId = req.params.id;

                    if (length) {

                        if (suppliers.every(supplier => supplier.id !== newSupplierId)) {

                            throw new CustomError({
                                description: "The supplier data is already present in the database",
                                status: 400,
                            }, "The supplier data is already present in the database");
                        }
                    }

                    next();
                })
                .catch(next);
        } else {
            next();
        }
    }

}

module.exports = SuppliersIdMiddlewares;
