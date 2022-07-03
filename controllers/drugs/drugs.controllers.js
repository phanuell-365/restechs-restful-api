// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
//
// const sources = require("../../src/drugs/drugs.src");
// const CustomError = require("../../error/CustomError.error");

module.exports = {

    /**
     * @description Handles the get request to the /drugs route
     * @param req The request object
     * @param res The response object
     * @param next
     */
    get(req, res, next) {
        Drug.findAll()
            .then((drugs) => {

                console.log(res.locals);

                drugs.forEach(drug => console.log(drug.toJSON()));

                if (res.headersSent) {
                    console.log("Aah! Shit! Headers been sent");
                    // next(err);
                } else {
                    console.log("Oh! Ah! Not Yet Still");
                }

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
    post(req, res, next) {

        if (res.locals.validDrugInfo) {

            const validDrugInfo = res.locals.validDrugInfo;

            Drug.create(validDrugInfo)

                .then((drug) => {
                    if (!res.locals.drugExists) {

                        return drug.save();
                    }
                    res.status(400).json({
                        description: `Error! The drug with the data ${Object.values(req.body)} already exists`,
                    });

                })
                .then((drug) => {

                    console.log("Successfully created the drug ->", drug.toJSON());

                    res.status(201).json({
                        description: "Successfully added the drug into the database",
                    });

                })
                .catch(next);
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