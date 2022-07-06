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


        if (req.method !== "GET" && req.method === "PUT") {

            Promise.resolve()
                .then(() => {

                    console.log("Checking if all the attributes are present");

                    const requestDrugAttributes = Object.keys(req.body).sort();

                    const drugAttrs = [...drugAttributes];

                    requestDrugAttributes.forEach((requestDrugAttr) => {

                        const reqDrugIndex = drugAttrs.indexOf(requestDrugAttr);

                        drugAttrs.splice(reqDrugIndex, 1);

                    });

                    console.log("The value of requestDrugAttributes -> ", requestDrugAttributes);
                    console.log("The value of drugAttrs -> ", drugAttrs);

                    if (drugAttrs.length) {

                        throw new CustomError({
                            description: "Error!! Failed to update the drug. The attributes " + drugAttrs + " haven't be passed",
                            status: 400,
                        }, "Error!! Failed to update the drug. The attributes " + drugAttrs + " haven't be passed");
                    }

                    next();
                })
                .catch(next);
        } else {

            next();
        }

    }

    /**
     * @desc Checks if the drug id passed in the request body is valid
     * @param req The request body
     * @param res   The response object
     * @param next  Callback
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
     * @param {Function} next The next middleware
     */
    static checkForDuplicateDrugData(req, res, next) {

        if (req.method !== "GET") {
            Promise.resolve()
                .then(() => {

                console.log('Validating if the passed drug details match one in the database ...');

                const newDrugDetails = res.locals.validDrugInfo;

                if (req.method === "PATCH") {

                    return Drug.findByPk(req.params.id)

                        .then((drug) => {

                            return Drug.findAndCountAll({

                                where: {
                                    name: newDrugDetails.name || drug.name,
                                    doseForm: newDrugDetails.doseForm || drug.doseForm,
                                    strength: newDrugDetails.strength || drug.strength,
                                    levelOfUse: newDrugDetails.levelOfUse || drug.levelOfUse,
                                },
                            });
                        }).catch(next);
                } else if (req.method === "PUT") {

                    return Drug.findAndCountAll({
                        where: {
                            name: newDrugDetails.name,
                            doseForm: newDrugDetails.doseForm,
                            strength: newDrugDetails.strength,
                            levelOfUse: newDrugDetails.levelOfUse,
                        }
                    });
                }

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