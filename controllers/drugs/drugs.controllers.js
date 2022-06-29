// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");

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
            issueUnitPerPackSize,
            packSize,
            packSizeCost,
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
            !issueUnitPerPackSize ||
            !packSize ||
            !packSizeCost ||
            !expiryDate
        ) {
            res.json({
                body: req.body,
                msg: "Error not all fields have been fed!!",
            });
        } else {
            Drug.create({
                name: name,
                doseForm: doseForm,
                strength: strength,
                levelOfUse: levelOfUse,
                therapeuticCategory: therapeuticCategory,
                issueUnit: issueUnit,
                issueUnitPrice: issueUnitPrice,
                issueUnitPerPackSize: issueUnitPerPackSize,
                packSize: packSize,
                packSizeCost: packSizeCost,
                expiryDate: expiryDate,
                quantity: 0,
            }).then((drug) => {
                return drug.save();
            }).then((drug) => res.json(drug))
                .catch((err) => res.json({
                    errMsg: "Error!",
                    err,
                }));

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