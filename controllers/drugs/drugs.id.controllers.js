// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
require("lodash");
const {validateLevelOfUseAndIssueUnitPrice} = require("../../src/drugs/drugs.src");

module.exports = {
    getDrugsId(req, res) {

        const drugId = req.params.id;

        Drug.findByPk(drugId).then((drug) => {
            res.json(drug);
        }).catch(err => {
            res.json({
                errMsg: "Error!",
                err
            });
        });
    },

    putDrugsId(req, res) {

        const drugId = req.params.id;

        Drug.findByPk(drugId).then((drug) => {

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

            if (
                !name ||
                !doseForm ||
                !strength ||
                !levelOfUse ||
                !therapeuticCategory ||
                !issueUnit ||
                !issueUnitPrice ||
                !expiryDate
            ) {
                res.json({
                    body: req.body,
                    msg: "Error not all fields have been fed!!",
                });
            }

            // the drug quantity is a calculated field, hence it shouldn't be fetched.
            else if (req.body.quantity) {

                res.json({
                    errMsg: "Error! Cannot update the quantity of a drug",
                });

            } else {

                // validateLevelOfUseAndIssueUnitPrice(req.body, res);

                Drug.validateLevelOfUse(req.body, res);
                Drug.validateIssueUnitPrice(req.body, res);

                drug.update({
                    name,
                    doseForm,
                    strength,
                    levelOfUse,
                    therapeuticCategory,
                    issueUnit,
                    issueUnitPrice,
                    expiryDate,
                    quantity: 0,
                }).then((drug) => {
                    return drug.save();

                }).then((drug) => {
                    res.json(drug);
                }).catch((err) => {
                    res.json({
                        errMsg: "Error!",
                        err
                    });
                });
            }
        }).catch((err) => {
            res.json({
                errMsg: "Error!",
                err
            });
        });
    },

    patchDrugsId(req, res) {

        const DrugId = req.params.id;
        const drugContent = req.body;


        Drug.findByPk(DrugId).then((drug) => {


            // check to see if the drug is being re entered and if so,
            // increment the drugs quantity
            validateLevelOfUseAndIssueUnitPrice(req.body);

            // the drug quantity is a calculated field, hence it shouldn't be fetched.
            if (req.body.quantity) {
                res.json({
                    errMsg: "Error! Cannot update the quantity of a drug",
                });
            }
            return drug.update(drugContent);
        }).then((drug) => {
            // console.log(drug);
            return drug;
        }).then((drug) => {
            res.json(drug);
        }).catch((err) => {
            // console.log("Error Occurred");
            res.json({
                errMsg: "Error!",
                err,
            });
        });
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
};