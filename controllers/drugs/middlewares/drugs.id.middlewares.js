// jshint esversion:9

"use strict";

const Drug = require("../../../models/drugs.model");
const CustomError = require("../../../error/CustomError.error");
const DrugMiddlewares = require("../../drugs/middlewares/drugs.middlewares");
const {drugAttributes} = require("../../../data/drugs/drugs.data");

class DrugsIdMiddlewares extends DrugMiddlewares {

    /**
     *
     * @param req
     * @param res
     * @param next
     */
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

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    static checkIfIdAttrPassed(req, res, next) {

        if (req.method !== "GET") {

            Promise.resolve().then(() => {

                console.log("Checking if id attribute was passed in request body ...");

                const reqBodyKeys = Object.keys(req.body);

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

    /**
     * @desc Checks if the request body contains any duplicate data It selects all the drug details in the database, collects the drug id in the request body, then checks if the drug id matches any of the selected drugs in the database. If a match is found, the drug update will proceed, else an exception will be thrown
     * @overview Requires checkForUndefined() method to be called before calling it
     * @throws CustomError
     * @param {Object} req The request body
     * @param {Object} res The response o
     * @param {Function} next Callback
     */
    static checkForDuplicateDrugData(req, res, next) {

        if (req.method !== "GET"){
            Promise.resolve().then(() => {
                console.log('Validating if the passed drug details match one in the database ...');

                const newDrugDetails = res.locals.validDrugInfo;

                return Drug.findAndCountAll({
                    where: {
                        name: newDrugDetails.name,
                        doseForm: newDrugDetails.doseForm,
                        strength: newDrugDetails.strength,
                        levelOfUse: newDrugDetails.levelOfUse,
                    }
                });
            })
                .then(({count: length, rows: drugs}) => {

                    console.log("The drug with the id passed in req.params.id");

                    const newDrugId = req.params.id;

                    if (length) {

                        if (drugs.every(drug => drug.id !== newDrugId)) {
                            // console.log("Checking if drug.id: ", drug.id, "")
                            throw new CustomError({
                                description: `Error! The drug with the data ${drugs.toString()} already exists`,
                                status: 400
                            }, `Error! The drug with the data ${drugs.toString()} already exists`);
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

module.exports = DrugsIdMiddlewares;