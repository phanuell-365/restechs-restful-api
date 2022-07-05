// jshint esversion:9

"use strict";

const Drug = require("../../../models/drugs.model");
const CustomError = require("../../../error/CustomError.error");
const DrugMiddlewares = require("../../drugs/middlewares/drugs.middlewares");
const {drugAttributes} = require("../../../data/drugs/drugs.data");
const sources = require("../../../src/drugs/drugs.src");

class DrugsIdMiddlewares extends DrugMiddlewares {

    static checkIfAllAttrArePresent(req, res, next) {

        if (req.method !== "GET" && (res.req.method === "PUT" || res.req.method === "PATCH")) {
            Promise.resolve().then(() => {

                let requestDrugAttributes = Object.keys(req.body).sort();

                let cacheDrugAttributes = [];

                console.log("The request drug attributes -> ", requestDrugAttributes);
                console.log("The valid drug attributes -> ", drugAttributes.sort());

                drugAttributes.sort();
                drugAttributes.forEach(async (drugAttribute) => {

                    requestDrugAttributes = requestDrugAttributes.filter((requestDrugAttribute) => drugAttribute === requestDrugAttribute);

                });

                console.log("Final value of cacheDrugAttributes -> ", cacheDrugAttributes);
                console.log("Final value of requestDrugAttributes -> ", requestDrugAttributes);

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

                console.log("Checking if id attribute was passed in request body ...");

                const reqBodyKeys = Object.keys(req.body);

                // console.log("The keys sent inside the request object -> ", reqBodyKeys);

                if (reqBodyKeys.includes("id")) {

                    res.locals.isIdPassed = true;
                    throw new CustomError({
                        description: "The id is an automatically generated attributed, it may not be set",
                        status: 400,
                    }, "The quantity is an automatically generated attributed, it may not be set");

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

    static checkIfUpdatedDrugInfoMatchesExistent(req, res, next) {

        if (req.method !== "GET" && (res.req.method === "PUT" || res.req.method === "PATCH")) {

            Promise.resolve().then(() => {

                super.checkIfDrugExists(req, res, next);

                const existentDrugs = Array((async () => {
                    return res.locals.existentDrugs;
                })());

                console.log("Checking if the updated drug info inside the request body match a drug that exists ...");

                const drugId = req.params.id;

                let foundDrug = {};

                Drug.findByPk(drugId)

                    .then((drug) => {

                        console.log("Found the drug -> ", drug.toJSON());

                        foundDrug = {...drug};

                        existentDrugs.forEach((drug) => {

                            if (drug.id !== foundDrug.id) {

                                throw new CustomError({
                                    description: `The drug info entered already matches an existing one${JSON.stringify(drug.toJSON())}`,
                                    status: 400,
                                }, `The drug info entered already matches an existing one \n${drug.toJSON()}`);
                            }
                        });
                        next();
                    })
                    .catch(next);

            })
                .catch(next);

        } else {

            next();
        }
    }

    static checkForDuplicateDrugData(req, res, next) {

        if (req.method !== "GET") {

            Promise.resolve()

                .then(async () => {

                    const drugId = req.params.id;

                    const drugAttributes = ["id", "name", "doseForm", "strength", "levelOfUse"];

                    try {
                        const allDrugsAttributes = await sources.getDrugsAttributes(drugAttributes);

                        const requestDrugInfoValues = await sources.getDrugAttributes(drugId, drugAttributes);

                        console.log("The value of allDrugsAttributes ->", allDrugsAttributes);

                        for (const drugAttributeVal of allDrugsAttributes) {

                            console.log("Checking if the id ", drugAttributeVal.id, " is same as ", requestDrugInfoValues.id);

                            if (drugAttributeVal.id !== requestDrugInfoValues.id) {

                                throw new CustomError({
                                    description: "The update request contains drug data that match a drug in the database",
                                }, "The update request contains drug data that match a drug in the database");

                            } else if (drugAttributeVal.name === requestDrugInfoValues.name &&
                                drugAttributeVal.doseForm === requestDrugInfoValues.doseForm &&
                                drugAttributeVal.strength === requestDrugInfoValues.strength &&
                                drugAttributeVal.levelOfUse === requestDrugInfoValues.levelOfUse &&
                                drugAttributeVal.id !== requestDrugInfoValues.id) {

                                throw new CustomError({
                                    description: "The update request contains drug data that match a drug in the database",
                                }, "The update request contains drug data that match a drug in the database");

                            } else {
                                break;
                            }
                        }

                    } catch (err) {
                        next(err);
                    }

                    next();

                })


                .catch(next);
        } else {

            next();

        }


    }

}

module.exports = DrugsIdMiddlewares;