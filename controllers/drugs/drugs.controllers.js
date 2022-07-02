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


        // handle any errors that might occur while checking if a drug exists
        try {
            // check to see if the drug is being re entered and if so,
            // then it's an error, since the drug already exists.
            // checkIfDrugExists(req.body).then(async (drugExistsResult) => {

            const drugExistsResult = await sources.checkIfDrugExistsNearMatch(req.body);

            if (drugExistsResult.status < 200 || drugExistsResult.status > 399) {

                res.status(drugExistsResult.status).json(drugExistsResult);

            } else {

                Drug.create({
                    name,
                    doseForm,
                    strength,
                    levelOfUse,
                    therapeuticCategory,
                    issueUnit,
                    issueUnitPrice,
                    expiryDate,
                }).then((drug) => {
                    return drug.save();
                }).then((drug) => {

                    console.log(`Created the drug ${drug.toJSON()}`);

                    res.status(201).json({
                        description: "Successfully added the drug into the database",
                        status: 201,
                    });
                }).catch((err) => {

                    if (err.name === "SequelizeValidationError") {

                        console.error(err);

                        const errorMessages = err.message.split("\n");

                        res.status(400).json({
                            description: errorMessages,
                            status: 400,
                            errorsCount: errorMessages.length,
                        });

                    } else {

                        console.error(err);

                        res.status(500).json({
                            description: "Error! Failed to check if the drug exists in the database",
                            status: 500,
                        });
                    }
                });

            }
        } catch (err) {
            console.error(err);

            res.status(500).json({
                description: "Error! Failed to load resource checkIfDrugExistsNearMatch ()",
                status: 500,
            });
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

}
;