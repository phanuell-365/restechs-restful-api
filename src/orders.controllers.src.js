// jshint esversion:9

"use strict";

const Drug = require("../models/drugs.model");

module.exports = {

    /**
     * @description Calculates the value of the order delivered by a supplier
     * @param orderQuantity The total number of packs delivered
     * @param drugId The drugId of the drug delivered
     * @returns {number} The value of the delivered drug
     */
    async calcOrderValue(orderQuantity, drugId) {

        let orderValue = 0;

        const foundDrug = await Drug.findByPk(drugId);

        orderValue = orderQuantity * foundDrug.packSizeCost;

        return orderValue;
    },

    /**
     * @description Calculates and updates the drug quantity of a drug
     * @param orderQuantity The number of packs delivered to the pharmacy
     * @param drugId The drugId for the delivered drug
     */
    calcDrugQuantity(orderQuantity, drugId) {

        Drug.findByPk(drugId).then((drug) => {
            let drgQuantity = orderQuantity * drug.issueUnitPerPackSize;
            const currentDrugQuantity = drug.quantity;
            drgQuantity += currentDrugQuantity;
            return drug.update({quantity: drgQuantity});
        }).then((drug) => {
            console.log("The drug was successfully updated", drug.toJSON());
        }).catch((err) => {
            console.log(err);
        });
    },
};