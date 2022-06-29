// jshint esversion:9

"use strict";

const Drug = require("../../models/drugs.model");

module.exports = {

    async calcSellingPrice(drugId) {

        let val;

        await Drug.findByPk(drugId).then((drug) => {

            val = drug.issueUnitPrice;

            // console.log("val => ", val);

        }).catch((err) => {

            console.log(err);

        });

        // console.log("val => ", val);

        return val;
    }
};