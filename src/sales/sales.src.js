// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");

module.exports = {

    updateDrugQuantity(drugId, drugQuantity) {

        Drug.findByPk(drugId).then((drug) => {

            const currentDrugQuantity = drug.quantity;

            let newDrugQuantity = currentDrugQuantity - drugQuantity;

            if (newDrugQuantity <= 10) {
                return "Error";
            } else {
                return drug.update({quantity: newDrugQuantity});
            }

        }).then(() => {

            console.log("Successfully updated the drug quantity");

        }).catch((err) => {

            console.log("Error! Failed to update the drug", err);

        });
    },

    async calcTotalPrice(drugId, quantity) {


        const foundDrug = await Drug.findByPk(drugId);

        const drugPrice = foundDrug.issueUnitPrice;

        return drugPrice * quantity;

    },

    // notify(val, res) {
    //     res.json({
    //         errMsg: "Error! Not enough drugs left.",
    //         val
    //     });
    // }
};