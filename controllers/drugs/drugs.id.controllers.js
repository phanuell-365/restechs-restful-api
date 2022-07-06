// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
const CustomError = require("../../error/CustomError.error");

module.exports = {

    getDrugById(req, res, next) {

        const drugId = req.params.id;

        Drug.findByPk(drugId)

            .then((drug) => {

                console.log(drug.toJSON());

                res.status(200).json(drug);

            }).catch(next);
    },

    putDrugById(req, res, next) {

        Promise.resolve()

            .then(() => {

                const drugId = req.params.id;

                return Drug.findByPk(drugId);

            })
            .then((drug) => {

                if (res.locals.validDrugInfo) {

                    console.log("Previous drug info -> ", drug.toJSON());

                    const validDrugInfo = res.locals.validDrugInfo;

                    return drug.update(validDrugInfo);

                } else {

                    throw new CustomError({
                        description: "The Server encountered an error while extracting valid drug info!",
                        status: 500,
                    }, "The Server encountered an error while extracting valid drug info!");

                }

            })
            .then((drug) => {

                console.log("Successfully updated the drug", drug.toJSON());

                res.status(200).json({
                    description: `Successfully updated the drug ${drug.toJSON()}`,
                });
            })

            .catch(next);

    },

    patchDrugsId(req, res, next) {

        Promise.resolve()
            .then(() => {

                const DrugId = req.params.id;

                return Drug.findByPk(DrugId);

            })
            .then((drug) => {

                console.log("Previous drug info -> ", drug.toJSON());

                if (res.locals.validDrugInfo) {

                    const validDrugInfo = res.locals.validDrugInfo;

                    return drug.update(validDrugInfo);
                } else {

                    throw new CustomError({
                        description: "The Server encountered an error while extracting valid drug info!",
                        status: 500,
                    }, "The Server encountered an error while extracting valid drug info!");

                }

            })
            .then((drug) => {

                console.log("Successfully updated the drug -> ", drug.toJSON());

                res.status(200).json({
                    description: "Successfully updated the drug " + drug.toJSON(),
                });
            })
            .catch(next);

    },


    deleteDrugsId(req, res) {

        const drugId = req.params.id;

        Drug.findByPk(drugId)
            .then((drug) => {
                return drug.destroy();
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