// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
const sources = require("../../src/drugs/drugs.src");

module.exports = {

    getDrugById(req, res, next) {

        // console.log("GET /api/drugs/:id");

        const drugId = req.params.id;

        Drug.findByPk(drugId)

            .then((drug) => {

                console.log(drug.toJSON());

                res.status(200).json(drug);

            }).catch(next);
    },

    putDrugById(req, res, next) {

        const drugId = req.params.id;

        if (res.locals.validDrugInfo) {

            const validDrugInfo = res.locals.validDrugInfo;

            Drug.findByPk(drugId)

                .then((drug) => {

                    console.log("Previous drug info -> ", drug.toJSON());

                    return drug.update(validDrugInfo);

                })
                .then((drug) => {

                    console.log("Successfully updated the drug", drug.toJSON());

                    res.status(200).json({
                        description: `Successfully updated the drug ${drug.toJSON()}`,
                    });
                })

                .catch(next);

        } else {

            res.status(500).json({
                description: "The Server encountered an error while extracting valid drug info!",
            });
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
                description: "Successfully updated the drug data in the database",
                flagStatus: true,
                status: 200,
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