// jshint esversion:9

"use strict";

const Drug = require("../models/drugs.model");

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
    deleteDrugs(req, res) {

        let jsonArr = [];
        let jsonErrArr = [];
        let errFlag = false;

        Drug.findAll().then((drugs) => {

            for (const resObj of drugs) {
                resObj.destroy().then(drug => {
                    jsonArr.push({...drug});
                }).catch(err => {
                    errFlag = true;
                    jsonErrArr.push({...err});
                });
            }

            res.json(!errFlag ? jsonArr : jsonErrArr);

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
            }).then(drug => {
                return drug.save();
            }).then(drug => res.json(drug))
                .catch(err => res.json({
                    errMsg: "Error!",
                    err,
                }));

        }

    }
};