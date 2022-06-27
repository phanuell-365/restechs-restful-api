// jshint esversion:9

"use strict";

const Drug = require("../models/drugs.model");
// const {where} = require("sequelize/types");

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

                drug.update({
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

        const drugId = req.params.id;
        const drugContent = req.body;

        // console.log(req.body);

        Drug.findByPk(drugId).then((drug) => {
            // console.log(drug.toJSON());
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