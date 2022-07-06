// jshint esversion:9

"use strict";

const Drug = require("../../../models/drugs.model");
const CustomError = require("../../../error/CustomError.error");
const _ = require("lodash");

class DrugMiddlewares {


    static checkIfQuantityAttrPassed(req, res, next) {
        if (req.method !== "GET") {

            Promise.resolve().then(() => {

                console.log("Checking if quantity attribute was passed in request body ...");

                const reqBodyKeys = Object.keys(req.body);

                if (reqBodyKeys.includes("quantity")) {

                    res.locals.isQuantityPassed = true;
                    throw new CustomError({
                        description: "The quantity is a computed attributed, it may not be set",
                        status: 400,
                    }, "The quantity is a computed attributed, it may not be set");

                } else {
                    res.locals.isQuantityPassed = false;
                    next();
                }
            }).catch(next);
        } else {
            next();
        }

    }

    static checkForUndefined(req, res, next) {
        if (req.method !== "GET") {

            Promise.resolve().then(() => {

                console.log("Checking for undefined values in the request body ...");

                const newObj = Object(req.body);

                res.locals.undefinedAttributes = [];

                res.locals.validDrugValuesMap = new Map();

                Object.entries(newObj).forEach(([key, value]) => {

                    if (value === undefined || value === null || !value) {

                        console.error(`Undefined attribute -> ${key}`);

                        res.locals.undefinedAttributes.push(key);

                        throw new CustomError({
                            description: `The value of ${key} is null`,
                            status: 400,
                        }, `The value of ${key} is null`);
                    } else {

                        res.locals.validDrugValuesMap.set(key, value);
                    }
                });
                next();

            })
                .catch(next);
        } else {
            next();
        }
    }

    static extractValidDrugInfo(req, res, next) {

        if (req.method !== "GET") {

            Promise.resolve().then(() => {
                if (res.locals.validDrugValuesMap) {
                    console.log("Extracting valid drug info ...");

                    // console.log("The value of valid drug value map ", res.locals.validDrugValuesMap);
                    console.log(res.locals.validDrugValuesMap);

                    // capitalize each attribute value
                    res.locals.validDrugValuesMap.forEach((value, key) => {
                        if (key === "issueUnit"){

                            res.locals.validDrugValuesMap.set(key, (value));
                        } else {
                            res.locals.validDrugValuesMap.set(key, _.capitalize(value));
                        }
                    });

                    res.locals.validDrugInfo = Object.fromEntries(res.locals.validDrugValuesMap.entries());

                    console.log("Creating a new valid object ...");
                    console.log("The new valid object ->", res.locals.validDrugInfo);
                }
                next();
            }).catch(next);


        } else {
            next();
        }

    }


    static fetchDrugIds(req, res, next) {

        return Drug.findAll()

            .then((allDrugs) => {

                res.locals.drugIds = [];

                allDrugs.forEach((drug) => {
                    res.locals.drugIds.push(drug.id);
                });

                next();
            })
            .catch(next);

    }


    /**
     * @description Check if a drug is already present in the database
     * @returns  A promise object containing the description,
     * flagStatus being true if the drug already exists and status
     * @param req
     * @param res
     * @param next
     */
    static checkIfDrugExists(req, res, next) {


        if (req.method !== "GET") {

            console.log("Checking if the drug info inside the request body match a drug that exists ...");

            Drug.findAll({
                where: {
                    name: req.body.name,
                    doseForm: req.body.doseForm,
                    strength: req.body.strength,
                    levelOfUse: req.body.levelOfUse,
                    therapeuticCategory: req.body.therapeuticCategory,
                    issueUnit: req.body.issueUnit,
                    issueUnitPrice: req.body.issueUnitPrice,
                    expiryDate: req.body.expiryDate,
                }

            }).then((drugs) => {

                // add the found drugs into res.locals

                res.locals.existentDrugs = Array(drugs);

                console.log("Printing res.locals.existentDrugs ->", drugs);

                console.log("Printing found drugs -> ", drugs);

                if (drugs.length) {

                    res.locals.drugExists = true;

                } else {

                    res.locals.drugExists = false;
                    next();
                }

            }).catch(next);
        } else {
            next();
        }


    }

    static checkIfDrugExistsNearMatch(req, res, next) {

        console.log("Checking if the drug info inside the request body nearly matches a drug that exists ...");

        if (res.req.method !== "GET") {
            Drug.findAll({
                where: {
                    name: req.body.name,
                    doseForm: req.body.doseForm,
                    strength: req.body.strength,
                    issueUnit: req.body.issueUnit,
                    expiryDate: req.body.expiryDate,
                }
            }).then((drugs) => {
                if (drugs.length) {

                    res.locals.drugExists = true;
                    next();

                } else {

                    res.locals.drugExists = false;

                    next();

                }
            }).catch(next);
        } else {
            next();
        }

    }


}

// DrugMiddlewares.checkForUndefined.call(DrugMiddlewares);
// DrugMiddlewares.checkIfDrugExists.call(DrugMiddlewares);

module.exports = DrugMiddlewares;