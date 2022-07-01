// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");

const sources = require("../../src/drugs/drugs.src");

module.exports = {

    /**
     * @description Handles the get request to the /drugs route
     * @param req The request object
     * @param res The response object
     */
    get(req, res) {

        Drug.findAll().then((drugs) => {

            res.status(200).json(drugs);

        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                description: "Error! Failed to read all the drug data from the database."
            });
        });
    },

    /**
     * @description Handles the post requests to the /drugs route
     * @param req The request object
     * @param res The response object
     */
    async post(req, res) {

        const {
            name,
            doseForm,
            strength,
            levelOfUse,
            therapeuticCategory,
            issueUnit,
            issueUnitPrice,
            expiryDate,
        } = req.body;

        // make an array of required fields

        const requiredFields = ["name", "doseForm", "strength", "levelOfUse", "therapeuticCategory", "issueUnit", "issueUnitPrice", "expiryDate"];

        const fieldPresResult = sources.checkFieldsArePresent(requiredFields, req.body);

        const fieldNullResult = sources.checkIfFieldsAreNull(req.body);

        const validateLevelOfUseRes = Drug.validateLevelOfUse(levelOfUse);

        const validateIssUniPriRes = Drug.validateIssueUnitPrice(issueUnitPrice);

        const validateDoseFrmIssUnitRes = Drug.validateDoseFormAndIssueUnit(doseForm, issueUnit);

        if (!fieldPresResult.flagStatus) {

            res.status(fieldPresResult.status).json(fieldPresResult);

        } else if (!fieldNullResult.flagStatus) {

            res.status(fieldNullResult.status).json(fieldNullResult);

        } else if (!validateLevelOfUseRes.flagStatus) {

            res.status(validateLevelOfUseRes.status).json(validateLevelOfUseRes);

        } else if (!validateIssUniPriRes.flagStatus) {

            res.status(validateIssUniPriRes.status).json(validateIssUniPriRes);

        } else if (!validateDoseFrmIssUnitRes.flagStatus) {

            res.status(validateDoseFrmIssUnitRes.status).json(validateDoseFrmIssUnitRes);

        } else {

            // handle any errors that might occur while checking if a drug exists
            try {
                // check to see if the drug is being re entered and if so,
                // then it's an error, since the drug already exists.
                // checkIfDrugExists(req.body).then(async (drugExistsResult) => {

                const drugExistsResult = await sources.checkIfDrugExistsNearMatch(req.body);

                // .then(async (drugExistsResult) => {
                if (drugExistsResult.flagStatus) {

                    res.status(drugExistsResult.status).json(drugExistsResult);

                } else {

                    const createdDrug = await Drug.create({
                        name,
                        doseForm,
                        strength,
                        levelOfUse,
                        therapeuticCategory,
                        issueUnit,
                        issueUnitPrice,
                        expiryDate,
                    });

                    // .then((drug) => {

                    // handle any exceptions thrown while saving the drug into the database
                    try {
                        await createdDrug.save();

                        res.status(201).json({
                            description: "Successfully added the drug into the database",
                            flagStatus: true,
                            status: 201,
                        });

                    } catch (e) {
                        console.error(e);

                        console.error(e.message);

                        res.status(500).json({
                            description: "Error! Failed to add the drug into the database",
                            flagStatus: false,
                            status: 500,
                        });
                    }
                }
            } catch (err) {
                console.error(err);

                console.error("err message -> ", err.message);
                console.error("err name ->", err.name);
                console.error("err cause ->", err.cause);
                console.error("err options ->", err.options);

                res.status(500).json({
                    description: "Error! Failed to check if the drug exists in the database",
                    flagStatus: false,
                    status: 500,
                });
            }
        }
    },


// TODO: Change the logic for deletion to cancellation

    delete(req, res) {

        Drug.findAll().then((drugs) => {

            const destroyedDrugs = [];

            drugs.forEach((drug) => {

                drug.destroy().then((drug) => {

                    destroyedDrugs.push({...drug});

                }).catch(err => {

                    res.status(500).json({
                        status: 500,
                        description: "Error! Failed to delete the drug.",
                        err,
                    });
                });
            });

            res.status(200).json({
                description: "Successfully deleted all the drugs",
                flagStatus: true,
                status: 200,
                destroyedDrugs,
            }).status(200);

        }).catch((err) => {
            res.status(500).json({
                description: "Error! Failed to delete the drugs from the database",
                status: 500,
                err
            });
        });
    },

};