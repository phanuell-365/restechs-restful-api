// jshint esversion:9

"use strict";

const Supplier = require("../../../models/suppliers.model");
const CustomError = require("../../../error/CustomError.error");

class SuppliersMiddlewares {

    static checkForUndefined(req, res, next) {

        if (res.req.method !== "GET") {

            Promise.resolve().then(() => {

                console.log("Checking for undefined values in the request body ...");

                const newSupplierObj = Object(req.body);

                res.locals.undefinedAttributes = [];
                res.locals.validSupplierValuesMap = new Map();

                Object.entries(newSupplierObj).forEach((([key, value]) => {

                    Promise.resolve().then(() => {

                        if (value === undefined || value === null || !value) {

                            console.error(`Undefined attribute -> ${key}`);

                            res.locals.undefinedAttributes.push(key);

                            throw new CustomError({
                                description: `The value of ${key} is null`,
                                status: 400,
                            }, `The value of ${key} is null`);
                        } else {
                            res.locals.validSupplierValuesMap.set(key, value);
                        }

                    })
                        .catch(next);
                }));
                next();
            })
                .catch(next);

        } else {

            next();

        }
    }

    static checkIfSupplierExists(req, res, next) {

        if (res.req.method !== "GET") {

            console.log("Checking if the supplier info inside the request body match a supplier that exists ...");

            Supplier.findAll({
                where: {
                    name: req.body.name,
                    email: req.body.email,
                    contact: req.body.contact,
                }
            })
                .then((suppliers) => {

                    if (suppliers.length) {

                        res.locals.supplierExists = true;

                        throw new CustomError({
                            description: `The supplier info entered already matches an existing one${JSON.stringify(suppliers[0].toJSON())}`,
                            status: 400,
                        }, `The supplier info entered already matches an existing one \n${suppliers[0].toJSON()}`);

                    } else {

                        res.locals.supplierExists = false;
                        next();
                    }
                })
                .catch(next);

        } else {

            next();

        }
    }

    static checkIfSupplierShareContact(req, res, next) {

        if (res.req.method !== "GET") {

            console.log("Checking if the supplier contact inside the request body matches another supplier's contact ...");

            Supplier.findAll({
                where: {
                    contact: req.body.contact,
                }
            })
                .then((suppliers) => {
                    if (suppliers.length) {

                        res.locals.supplierExists = true;

                        throw new CustomError({
                            description: `The supplier contact entered already matches an existing one${JSON.stringify(suppliers[0].toJSON())}`,
                            status: 400,
                        }, `The supplier contact entered already matches an existing one \n${suppliers[0].toJSON()}`);
                    } else {

                        res.locals.supplierExists = false;

                        next();
                    }
                })
                .catch(next);

        } else {

            next();

        }
    }


    static checkIfSupplierShareEmail(req, res, next) {

        if (res.req.method !== "GET") {

            console.log("Checking if the supplier email inside the request body matches another supplier's email ...");

            Supplier.findAll({
                where: {
                    email: req.body.email,
                }
            })
                .then((suppliers) => {
                    if (suppliers.length) {

                        res.locals.supplierExists = true;

                        throw new CustomError({
                            description: `The supplier email entered already matches an existing one${JSON.stringify(suppliers[0].toJSON())}`,
                            status: 400,
                        }, `The supplier email entered already matches an existing one \n${suppliers[0].toJSON()}`);
                    } else {

                        res.locals.supplierExists = false;

                        next();
                    }
                })
                .catch(next);

        } else {

            next();

        }
    }

    static extractValidSupplierInfo(req, res, next) {

        if (res.req.method !== "GET") {

            console.log("Extracting valid supplier info ...");

            if (res.locals.validSupplierValuesMap) {

                res.locals.validSupplierInfo = Object.fromEntries(res.locals.validSupplierValuesMap.entries());

                console.log("Creating a new valid object ...");
                console.log("The new valid object ->", res.locals.validSupplierInfo);
            }

            next();

        } else {

            next();
        }
    }
}

module.exports = SuppliersMiddlewares;