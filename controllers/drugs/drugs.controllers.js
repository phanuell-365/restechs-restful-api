// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
const _ = require("lodash");
const {checkIfDrugExists, incrementDrugQuantity} = require("../../src/drugs/drugs.src");

module.exports = {

    getDrugs(req, res) {

        Drug.findAll().then((drugs) => {

            res.json(drugs);

        }).catch((err) => {

            res.json({
                errMsg: "Error!",
                err
            });
        });
    },

    postDrugs(req, res) {

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

            const intLevelOfUse = _.toInteger(levelOfUse);
            const doubleIssueUnitPrice = _.toNumber(issueUnitPrice);

            if (intLevelOfUse <= 0) {

                res.json({
                    errMsg: `The drug level of use cannot be ${intLevelOfUse}`
                });

            } else if (doubleIssueUnitPrice <= 0) {

                res.json({
                    errMsg: `The drug issue unit price cannot be ${doubleIssueUnitPrice}`
                });

            }

            // check to see if the drug is being re entered and if so,
            // increment the drugs quantity
            checkIfDrugExists(req.body).then((status) => {

                if (status.found) {

                    incrementDrugQuantity(status.drugs);

                    res.json({
                        msg: "Successfully incremented the quantity of the drugs",
                    });

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
                        quantity: 0,
                    }).then((drug) => {
                        return drug.save();
                    }).then((drug) => res.json(drug))
                        .catch((err) => res.json({
                            errMsg: "Error!",
                            err,
                        }));
                }
            });
        }
    },

    deleteDrugs(req, res) {

        Drug.findAll().then((drugs) => {

            const destroyedDrugs = [];

            drugs.forEach((drug) => {

                drug.destroy().then((drug) => {

                    destroyedDrugs.push({...drug});

                }).catch(err => {

                    res.json({
                        errMsg: "Error! Failed to delete the drug.",
                        err,
                    });
                });
            });

            res.json({
                msg: "Successfully deleted all the drugs",
                destroyedDrugs,
            });

        }).catch((err) => {
            res.json({
                errMsg: "Error!",
                err
            });
        });
    },
};