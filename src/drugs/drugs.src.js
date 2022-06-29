// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");
const _ = require("lodash");

module.exports = {

    async checkIfDrugExists(drugInfo) {

        let status = {
            found: false,
            drugs: {},
        };

        const drugs = await Drug.findAll({
            where: {
                name: drugInfo.name,
                doseForm: drugInfo.doseForm,
                strength: drugInfo.strength,
                levelOfUse: drugInfo.levelOfUse,
                issueUnit: drugInfo.issueUnit,
                issueUnitPrice: drugInfo.issueUnitPrice,
                expiryDate: drugInfo.expiryDate,
            }
        });

        if (!_.isEmpty(drugs)) {
            status.found = true;
            status.drugs = drugs;

            return status;
        }

        status.found = false;
        status.drugs = drugs;

        console.log(status);

        return status;
    },

    incrementDrugQuantity(drugs) {

        drugs.forEach((drug) => {

            let currentQuantity = drug.quantity;

            currentQuantity++;

            drug.update({quantity: currentQuantity}).catch((err) => {

                console.error("Error! Failed to increment the drug's quantity", err);

            });
        });
    }
};