// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
const sources = require("../../src/drugs/drugs.src");

module.exports = {
    getDrugsId(req, res) {

        const drugId = req.params.id;

        Drug.findByPk(drugId).then((drug) => {

            res.status(200).json(drug);

        }).catch(err => {

            console.error(err);

            res.status(500).json({
                errMsg: "Error! Failed to read the drug from the database"
            });

        });
    },

    async putDrugsId(req, res) {

        const drugId = req.params.id;

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

        const drug = await Drug.findByPk(drugId);

        // make an array of required fields

        const requiredFields = ["name", "doseForm", "strength", "levelOfUse", "therapeuticCategory", "issueUnit", "issueUnitPrice", "expiryDate"];

        // cache the result of checking if the required fields are present in the request body

        const fieldPresResult = sources.checkFieldsArePresent(requiredFields, req.body);

        // cache the result of checking if all the requested fields are filled

        const fieldNullResult = sources.checkIfFieldsAreNull(req.body);

        // cache the result of validating the level of use of the new drug details

        const validLevelOfUseResult = Drug.validateLevelOfUse(levelOfUse);

        // cache the result of validating the issue unit price of the new drug details

        const validIssueUnitPriceResult = Drug.validateIssueUnitPrice(issueUnitPrice);

        // cache the result of validating the dose form and the issue unit

        const validateDoseFrmIssUnitRes = Drug.validateDoseFormAndIssueUnit(doseForm, issueUnit);

        if (!fieldPresResult.flagStatus) {

            res.status(fieldPresResult.status).json(fieldPresResult);

        } else if (!fieldNullResult.flagStatus) {

            res.status(fieldNullResult.status).json(fieldNullResult);

        } else if (!validLevelOfUseResult.flagStatus) {

            res.status(validLevelOfUseResult.status).json(validLevelOfUseResult);

        } else if (!validIssueUnitPriceResult.flagStatus) {

            res.status(validIssueUnitPriceResult.status).json(validIssueUnitPriceResult);

        } else if (!validateDoseFrmIssUnitRes.flagStatus) {

            res.status(validateDoseFrmIssUnitRes.status).json(validateDoseFrmIssUnitRes);

        } else {

            try {
                // check if the drug data to update already exists

                const drugExistsResult = await sources.checkIfDrugExists(req.body);

                if (drugExistsResult.flagStatus) {

                    res.status(drugExistsResult.status).json(drugExistsResult);

                } else {

                    try {

                        await drug.update({
                            name,
                            doseForm,
                            strength,
                            levelOfUse,
                            therapeuticCategory,
                            issueUnit,
                            issueUnitPrice,
                            expiryDate,
                        });

                    } catch (err) {

                        console.error(err);

                        res.status(500).json({
                            description: "Error! Failed to update the drug in the database",
                            flagStatus: false,
                            status: 500,
                        });
                    }
                }
            } catch (err) {

                console.error(err);

                res.status(500).json({
                    description: "Error! Failed to load the checkIfDrugExistsNearMatch() resource",
                    flagStatus: false,
                    status: 500,
                });
            }
        }

    },

    async patchDrugsId(req, res) {

        const DrugId = req.params.id;
        const drugContent = req.body;


        const drug = await Drug.findByPk(DrugId);

        // cache the result of trapping the quantity attribute

        const trapQuantityResult = sources.trapQuantityAttribute(req.body);

        if (!trapQuantityResult.flagStatus) {
            res.status(trapQuantityResult.status).json(trapQuantityResult);
        }

        // check if  the dose form or the issue unit was edited
        if (req.body.doseForm) {

            if (!req.body.issueUnit) {

                const validateResponse = Drug.validateDoseFormAndIssueUnit(req.body.doseForm, drug.issueUnit);
                validateResponse.description = "Error! The updated dose form doesn't match the issue unit";
                return validateResponse;
            }
        } else if (req.body.issueUnit) {

            if (!req.body.doseForm) {

                const validateResponse = Drug.validateDoseFormAndIssueUnit(drug.doseForm, drug.issueUnit);
                validateResponse.description = "Error! The updated issue unit doesn't match the dose form";
                return validateResponse;
            }
        } else {

            // cache the result of validating the dose form and the issue unit

            const validateDoseFrmIssUnitRes = Drug.validateDoseFormAndIssueUnit(req.body.doseForm, req.body.issueUnit);

            if (!validateDoseFrmIssUnitRes.flagStatus) {

                res.status(validateDoseFrmIssUnitRes.status).json(validateDoseFrmIssUnitRes);

            }
        }

        if (req.body.levelOfUse) {

            const validateLOU = Drug.validateLevelOfUse(req.body.levelOfUse);

            if (!validateLOU.flagStatus) {
                res.status(validateLOU.status).json(validateLOU);
            }
        }

        if (req.body.issueUnitPrice) {

            const validateIssUnitPriceRes = Drug.validateIssueUnitPrice(req.body.issueUnitPrice);

            if (!validateIssUnitPriceRes.flagStatus) {
                res.status(validateIssUnitPriceRes.status).json(validateIssUnitPriceRes);
            }
        }

        try {
            await drug.update(drugContent);

            res.status(200).json({
                description : "Successfully updated the drug data in the database",
                flagStatus : true,
                status : 200,
            });

        } catch (err) {
            console.error(err);

            res.status(500).json({
                description: "Error! The server failed to update the drug data.",
                flagStatus: false,
                status: 500,
            });
        }
    },


    deleteDrugsId(req, res) {

        const drugId = req.params.id;

        Drug.findByPk(drugId).then((drug) => {
            return drug.destroy();
        }).then((drug) => {
            return drug;
        }).then((drug) => {
            res.json({
                msg: "The record was deleted successfully!",
                drug,
            });
        }).catch((err) => {
            res.json({
                errMsg: "Error! Failed to delete the record",
                err
            });
        });
    }
}
;