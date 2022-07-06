// jshint esversion:9

"use strict";

const Supplier = require("../../../models/suppliers.model");
const CustomError = require("../../../error/CustomError.error");
const _ = require("lodash");

class SuppliersMiddlewares {

    static checkForUndefined(req, res, next) {

        if (res.req.method !== "GET") {

            Promise.resolve().then(() => {

                console.log("Checking for undefined values in the request body ...");

                const newSupplierObj = Object(req.body);

                res.locals.undefinedAttributes = [];

                res.locals.validSupplierValuesMap = new Map();

                Object.entries(newSupplierObj).forEach(([key, value]) => {


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

                });
                next();
            })
                .catch(next);

        } else {

            next();

        }
    }

    static checkIfSupplierShareContact(req, res, next) {

        if (res.req.method !== "GET") {

            Promise.resolve().then(() => {
                console.log("Checking if the supplier contact inside the request body matches another supplier's contact ...");

                return Supplier.findAndCountAll({
                    where: {
                        contact: req.body.contact,
                    }
                });


            })
                .then(({count: length, rows: suppliers}) => {

                    if (length) {

                        throw new CustomError({
                            description: `The supplier contact entered already matches an existing one${JSON.stringify(suppliers[0].toJSON())}`,
                            status: 400,
                        }, `The supplier contact entered already matches an existing one \n${suppliers[0].toJSON()}`);
                    } else {

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

            Promise.resolve()
                .then(() => {
                    console.log("Checking if the supplier email inside the request body matches another supplier's email ...");

                    return Supplier.findAndCountAll({
                        where: {
                            email: req.body.email,
                        }
                    });

                })
                .then(({count: length, rows: suppliers}) => {
                    if (length) {

                        throw new CustomError({
                            description: `The supplier email entered already matches an existing one${JSON.stringify(suppliers[0].toJSON())}`,
                            status: 400,
                        }, `The supplier email entered already matches an existing one \n${suppliers[0].toJSON()}`);
                    } else {

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

            Promise.resolve().then(() => {

                if (res.locals.validSupplierValuesMap) {

                    console.log("Extracting valid supplier info ...");

                    console.log(res.locals.validSupplierValuesMap);

                    res.locals.validSupplierValuesMap.forEach((value, key) => {

                        res.locals.validSupplierValuesMap.set(key, _.capitalize(value));
                    });

                    res.locals.validSupplierInfo = Object.fromEntries(res.locals.validSupplierValuesMap.entries());

                    console.log("Creating new valid supplier object ...");
                    console.log("Valid supplier info: " + JSON.stringify(res.locals.validSupplierInfo));
                }
                next();
            })
                .catch(next);

        } else {

            next();
        }
    }
}

module.exports = SuppliersMiddlewares;