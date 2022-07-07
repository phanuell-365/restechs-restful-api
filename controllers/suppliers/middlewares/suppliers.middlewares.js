// jshint esversion:9

"use strict";

const Supplier = require("../../../models/suppliers.model");
const CustomError = require("../../../error/CustomError.error");
const _ = require("lodash");
const {MyArray} = require("../../../src/suppliers/suppliers.src");
const {supplierAttributes} = require("../../../data/suppliers/suppliers.data");

class SuppliersMiddlewares {

    static checkIfAllSupplierAttributesArePresent(req, res, next) {

        if (res.req.method !== "GET") {

            Promise.resolve()

                .then(() => {

                    const reqBody = Object(req.body);

                    supplierAttributes.forEach(attribute => {

                            if (!reqBody[attribute]) {

                                throw new CustomError({
                                    description: `The attribute ${attribute} is missing`,
                                    status: 400,
                                }, `The attribute ${attribute} is missing`);
                            }
                    });

                    next();

                })

                .catch(next);

        } else {

            next();

        }
    }

    static checkForUndefined(req, res, next) {

        if (res.req.method !== "GET") {

            Promise.resolve()

                .then(() => {

                    console.log("Checking for undefined values in the request body ...");

                    if (_.isEmpty(req.body)) {

                        throw new CustomError({
                            description: "The request body is empty",
                            status: 400,
                        }, "The request body is empty");

                    }

                    const newSupplierObj = Object(req.body);

                    console.log("The value of new suppliers object -> ", newSupplierObj);

                    res.locals.undefinedAttributes = [];

                    res.locals.validSupplierValuesMap = new Map();

                    Object.entries(newSupplierObj).forEach(([key, value]) => {

                        if (typeof value === undefined) {

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

            Promise.resolve()
                .then(() => {

                    const validatedSupplierInfo = Object.fromEntries(res.locals.validSupplierValuesMap.entries());

                    console.log("The value validated supplier info -> ", validatedSupplierInfo);

                    console.log("Checking if the supplier contact inside the request body matches another supplier's contact ...");

                    return Supplier.findAndCountAll({
                        where: {
                            contact: validatedSupplierInfo.contact,
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

                    const validatedSupplierInfo = Object.fromEntries(res.locals.validSupplierValuesMap.entries());

                    console.log("Checking if the supplier email inside the request body matches another supplier's email ...");

                    return Supplier.findAndCountAll({
                        where: {
                            email: validatedSupplierInfo.email,
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

            Promise.resolve()

                .then(() => {
                    console.log("Extracting valid supplier info ...");

                    const validatedSupplierInfo = Object.fromEntries(res.locals.validSupplierValuesMap.entries());

                    console.log("The value validated supplier info -> ", validatedSupplierInfo);

                    if (res.locals.validSupplierValuesMap) {


                        console.log(res.locals.validSupplierValuesMap);

                        res.locals.validSupplierValuesMap.forEach((value, key) => {

                            if (key === "email") {

                                res.locals.validSupplierValuesMap.set(key, value.toLowerCase());

                            } else {

                                res.locals.validSupplierValuesMap.set(key, value);

                            }
                            // res.locals.validSupplierValuesMap.set(key, _.capitalize(value));
                        });

                        res.locals.validatedSupplierInfo = Object.fromEntries(res.locals.validSupplierValuesMap.entries());

                        console.log("The value of validated supplier info -> ", res.locals.validatedSupplierInfo);

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