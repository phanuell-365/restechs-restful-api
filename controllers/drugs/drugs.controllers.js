// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");

module.exports = {

    /**
     * @description Handles the get request to the /drugs route
     * @param req The request object
     * @param res The response object
     * @param next
     */
    getDrugs(req, res, next) {
        Drug.findAll()

            .then((drugs) => {

                console.log("Displaying all drugs ...");
                res.status(200).json(drugs);

            })
            .catch(next);
    },

    /**
     * @description Handles the post requests to the /drugs route
     * @param req The request object
     * @param res The response object
     * @param next
     */
    postDrugs(req, res, next) {

        if (res.locals.validDrugInfo) {

            const validDrugInfo = res.locals.validDrugInfo;

            console.log("Valid drug info to add into the database => ", validDrugInfo);

            Drug.findOrCreate({
                where: {
                    name: validDrugInfo.name,
                    doseForm: validDrugInfo.doseForm,
                    strength: validDrugInfo.strength,
                    levelOfUse: validDrugInfo.levelOfUse,
                }, defaults: validDrugInfo,
            })
                .then(([drug, created]) => {

                    if (created) {

                        console.log(`Successfully created the drug and added it into the database -> ${drug.toJSON()}`);

                        res.status(200).json({
                            description: "Successfully created the drug and added it into the database",
                        });
                    } else {

                        res.status(400).json({
                            description: `Error! The drug with the data ${Object.values(req.body)} already exists`,
                        });

                    }

                })
                .catch(next);
        } else {

            res.status(500).json({
                description: "The Server encountered an error while extracting valid drug info!",
            });
        }
    },


// TODO: Change the logic for deletion to cancellation

    /**
     * @param {string|exports.delete} req
     * @param {function(*, *): void} res
     */
    deleteDrugs(req, res) {

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